import fs from "node:fs";
import path from "node:path";
import { generateDailyPost } from "./generator.ts";
import { postTweetToX } from "./x-client.ts";

interface HistoryItem {
  id: string;
  text: string;
  pillar: string;
  source: string;
  timestamp: string;
}

interface QueueItem {
  id: string;
  topic?: string;
  text: string;
  createdAt: string;
}

const ROOT_DIR = process.cwd();
const QUEUE_PATH = path.join(ROOT_DIR, "content", "x-queue.json");
const HISTORY_PATH = path.join(ROOT_DIR, "content", "x-history.json");

function loadJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.warn(`[x-poster] Could not parse ${filePath}, using fallback`, err);
  }
  return fallback;
}

function saveJson<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function runXPoster(args: string[] = process.argv.slice(2)): Promise<void> {
  const isDryRun = args.includes("--dry-run") || process.env.DRY_RUN === "true";
  const forceTopicIndex = args.indexOf("--force-topic");
  const forceTopic = forceTopicIndex !== -1 ? args[forceTopicIndex + 1] : undefined;

  console.log("==========================================");
  console.log("🚀 APURV SINGHAL · X DAILY AUTOMATION BOT");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log(`🛠️ Mode: ${isDryRun ? "DRY-RUN (Simulated)" : "PRODUCTION (Live Post)"}`);
  console.log("==========================================");

  // 1. Load History & Queue
  const history = loadJson<HistoryItem[]>(HISTORY_PATH, []);
  const queue = loadJson<QueueItem[]>(QUEUE_PATH, []);

  let postText = "";
  let pillar = "";
  let source = "queue";
  let dequeuedItemIndex = -1;

  // 2. Check Queue First
  if (queue.length > 0) {
    console.log(`📥 Found ${queue.length} item(s) in priority queue (content/x-queue.json).`);
    const item = queue[0];
    postText = item.text.trim();
    pillar = item.topic || "Queued Draft";
    source = "queue";
    dequeuedItemIndex = 0;
  } else {
    // 3. Generate from Pillar Engine
    console.log("📝 Queue is empty. Generating fresh post from day-of-week technical pillar...");
    const historyTexts = history.map((h) => h.text);
    const result = await generateDailyPost(forceTopic, historyTexts);
    postText = result.text.trim();
    pillar = result.pillar;
    source = result.source;
  }

  // 4. Strict Safety & Character Validation
  const charCount = postText.length;
  console.log("\n--- POST PREVIEW ---");
  console.log(`Pillar:  ${pillar} (${source.toUpperCase()})`);
  console.log(`Length:  ${charCount}/280 characters`);
  console.log("--------------------");
  console.log(postText);
  console.log("--------------------\n");

  if (charCount === 0) {
    throw new Error("[x-poster] Error: Generated post is empty.");
  }

  if (charCount > 280) {
    throw new Error(
      `[x-poster] Safety Error: Post exceeds 280 characters limit (${charCount} chars). Refusing to post.`,
    );
  }

  // 5. Execute Post or Simulate Dry Run
  if (isDryRun) {
    console.log("✅ [DRY-RUN] Verification complete! Post is valid and formatted cleanly.");
    console.log("✅ [DRY-RUN] No API call was made to X.");
    return;
  }

  console.log("📡 Publishing post to X API v2 (@apurvsinghal28)...");
  const published = await postTweetToX(postText);
  console.log(`🎉 Successfully published tweet! Tweet ID: ${published.id}`);

  // 6. Update History
  const historyEntry: HistoryItem = {
    id: published.id,
    text: postText,
    pillar,
    source,
    timestamp: new Date().toISOString(),
  };

  history.push(historyEntry);
  saveJson(HISTORY_PATH, history);
  console.log(`💾 Recorded tweet into ${HISTORY_PATH}`);

  // 7. If from queue, remove it
  if (dequeuedItemIndex !== -1) {
    queue.splice(dequeuedItemIndex, 1);
    saveJson(QUEUE_PATH, queue);
    console.log(`🧹 Removed processed draft from queue (${queue.length} remaining).`);
  }

  console.log("🚀 Daily posting complete. See you tomorrow at 9:00 AM AEST!");
}

// Auto-run if executed directly via CLI
if (process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js")) {
  runXPoster().catch((err) => {
    console.error("\n❌ Execution failed:", err.message);
    process.exit(1);
  });
}
