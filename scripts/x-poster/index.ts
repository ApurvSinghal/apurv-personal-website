import fs from "node:fs";
import path from "node:path";
import {
  generateDailyPost,
  generateBriefingForExistingPost,
  sanitizeGeneratedText,
  type PostBriefing,
} from "./generator.ts";
import { postTweetToX } from "./x-client.ts";
import { sendPostBriefingEmail } from "./notifier.ts";

interface HistoryItem {
  id: string;
  text: string;
  pillar: string;
  source: string;
  postedAt: string;
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
  let briefing: PostBriefing | undefined;

  // 2. Check Queue First
  if (queue.length > 0) {
    console.log(`📥 Found ${queue.length} item(s) in priority queue (content/x-queue.json).`);
    const item = queue[0];
    postText = sanitizeGeneratedText(item.text);
    pillar = item.topic || "Queued Draft";
    source = "queue";
    dequeuedItemIndex = 0;
    console.log("💡 Generating technical briefing and code example for queued post...");
    briefing = await generateBriefingForExistingPost(postText, pillar);
  } else {
    // 3. Generate from Pillar Engine
    console.log("📝 Queue is empty. Generating fresh post & briefing from day-of-week technical pillar...");
    const historyTexts = history.map((h) => h.text);
    const result = await generateDailyPost(forceTopic, historyTexts);
    postText = sanitizeGeneratedText(result.text);
    pillar = result.pillar;
    source = result.source;
    briefing = result.briefing;
  }

  if (!briefing) {
    briefing = await generateBriefingForExistingPost(postText, pillar);
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

  // Write GitHub Step Summary if running in GitHub Actions
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      const summary = `### 🚀 X Daily Post (${isDryRun ? "DRY-RUN SIMULATION" : "PUBLISHED LIVE"})\n\n- **Pillar:** ${pillar} (${source.toUpperCase()})\n- **Length:** ${charCount} / 280 chars\n- **Timestamp:** ${new Date().toISOString()}\n\n\`\`\`text\n${postText}\n\`\`\`\n\n#### 🧠 Architectural Concept\n${briefing.concept}\n\n\`\`\`${briefing.example.language || "text"}\n${briefing.example.code}\n\`\`\`\n`;
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary, "utf-8");
    } catch {
      // Ignore step summary errors
    }
  }

  // 5. Execute Post or Simulate Dry Run
  if (isDryRun) {
    console.log("✅ [DRY-RUN] Verification complete! Post is valid and formatted cleanly.");
    console.log("\n--- TECHNICAL BRIEFING PREVIEW ---");
    console.log(`Concept: ${briefing.concept}`);
    console.log(`Why It Matters: ${briefing.whyItMatters}`);
    console.log(`Code Example (${briefing.example.language}):\n${briefing.example.code}`);
    console.log("----------------------------------\n");

    if (process.env.SEND_EMAIL_IN_DRY_RUN === "true") {
      await sendPostBriefingEmail({
        tweetText: postText,
        pillar,
        source,
        briefing,
        isDryRun: true,
      });
    } else {
      console.log("ℹ️ [DRY-RUN] Email dispatch simulated (set SEND_EMAIL_IN_DRY_RUN=true to test live email).");
    }
    return;
  }

  console.log("📡 Publishing post to X API v2 (@apurvsinghal28)...");
  const published = await postTweetToX(postText);
  console.log(`🎉 Successfully published tweet! Tweet ID: ${published.id}`);

  // 6. Send Technical Briefing Email
  console.log("✉️ Dispatching technical briefing email via Resend...");
  await sendPostBriefingEmail({
    tweetId: published.id,
    tweetText: postText,
    pillar,
    source,
    briefing,
    isDryRun: false,
  });

  // 7. Update History
  const historyEntry: HistoryItem = {
    id: published.id,
    text: postText,
    pillar,
    source,
    postedAt: new Date().toISOString(),
  };

  history.push(historyEntry);
  saveJson(HISTORY_PATH, history);
  console.log(`💾 Recorded tweet into ${HISTORY_PATH}`);

  // 8. If from queue, remove it
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
