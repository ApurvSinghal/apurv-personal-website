import fs from "node:fs";
import path from "node:path";

export interface PostMetric {
  id: string;
  pillar: string;
  postedAt: string;
  text: string;
  views: number;
  likes: number;
  retweets: number;
  replies: number;
  bookmarks: number;
  url: string;
}

export interface AnalyticsSummary {
  trackedAt: string;
  totalPostsTracked: number;
  totalViews: number;
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  totalBookmarks: number;
  avgViewsPerPost: number;
  topPostByViews?: {
    id: string;
    views: number;
    pillar: string;
    text: string;
  };
}

export interface AnalyticsReport {
  summary: AnalyticsSummary;
  posts: PostMetric[];
}

const ROOT_DIR = process.cwd();
const HISTORY_PATH = path.join(ROOT_DIR, "content", "x-history.json");
const ANALYTICS_PATH = path.join(ROOT_DIR, "content", "x-analytics.json");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export function parseTweetMetricsFromHtml(html: string): Map<string, {
  views: number;
  likes: number;
  retweets: number;
  replies: number;
  bookmarks: number;
}> {
  const results = new Map<string, {
    views: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
  }>();

  // Pattern for counts: "client:VHdlZXQ6([A-Za-z0-9+/=]+):counts":$R[\d+]=({[^}]+})
  const countsPattern =
    /"client:VHdlZXQ6([A-Za-z0-9+/=]+):counts":\$R\[\d+\]=(\{[^}]+\})/g;
  // Pattern for views: "client:VHdlZXQ6([A-Za-z0-9+/=]+):views":$R[\d+]=({[^}]+})
  const viewsPattern =
    /"client:VHdlZXQ6([A-Za-z0-9+/=]+):views":\$R\[\d+\]=(\{[^}]+\})/g;

  let match: RegExpExecArray | null;

  while ((match = countsPattern.exec(html)) !== null) {
    try {
      const rawId = Buffer.from(match[1], "base64").toString("utf-8");
      const id = rawId.includes(":") ? rawId.split(":").pop()! : rawId;
      const dataStr = match[2];

      const favMatch = /favorite_count:(\d+)/.exec(dataStr);
      const rtMatch = /retweet_count:(\d+)/.exec(dataStr);
      const repMatch = /reply_count:(\d+)/.exec(dataStr);
      const bmMatch = /bookmark_count:(\d+)/.exec(dataStr);

      const existing = results.get(id) || {
        views: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        bookmarks: 0,
      };

      existing.likes = favMatch ? parseInt(favMatch[1], 10) : existing.likes;
      existing.retweets = rtMatch ? parseInt(rtMatch[1], 10) : existing.retweets;
      existing.replies = repMatch ? parseInt(repMatch[1], 10) : existing.replies;
      existing.bookmarks = bmMatch ? parseInt(bmMatch[1], 10) : existing.bookmarks;

      results.set(id, existing);
    } catch {
      // Ignore base64 decode or parse issues
    }
  }

  while ((match = viewsPattern.exec(html)) !== null) {
    try {
      const rawId = Buffer.from(match[1], "base64").toString("utf-8");
      const id = rawId.includes(":") ? rawId.split(":").pop()! : rawId;
      const dataStr = match[2];

      const countMatch = /count:"([^"]+)"/.exec(dataStr);
      const countVal = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) || 0 : 0;

      const existing = results.get(id) || {
        views: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        bookmarks: 0,
      };

      existing.views = countVal;
      results.set(id, existing);
    } catch {
      // Ignore
    }
  }

  return results;
}

export async function fetchHtmlWithRetry(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      return await res.text();
    }
  } catch (err) {
    console.warn(`[tracker] Warning: failed to fetch ${url}:`, err);
  }
  return null;
}

export async function collectXAnalytics(historyPath: string = HISTORY_PATH): Promise<AnalyticsReport> {
  if (!fs.existsSync(historyPath)) {
    throw new Error(`History file not found at ${historyPath}`);
  }

  const historyRaw = fs.readFileSync(historyPath, "utf-8");
  const history = JSON.parse(historyRaw) as {
    id: string;
    text: string;
    pillar: string;
    postedAt: string;
  }[];

  // Filter out non-numeric mock IDs (e.g. "1")
  const validHistory = history.filter((h) => /^\d{15,25}$/.test(String(h.id)));

  console.log(`[tracker] Found ${validHistory.length} live post(s) to track.`);

  const metricMap = new Map<string, {
    views: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
  }>();

  // 1. First fetch profile timeline (covers most recent 5-10 tweets in 1 request)
  console.log("[tracker] Fetching profile timeline for @apurvsinghal28...");
  const profileHtml = await fetchHtmlWithRetry("https://x.com/apurvsinghal28");
  if (profileHtml) {
    const timelineMetrics = parseTweetMetricsFromHtml(profileHtml);
    for (const [id, m] of timelineMetrics.entries()) {
      metricMap.set(id, m);
    }
    console.log(`[tracker] Profile scan extracted metrics for ${timelineMetrics.size} post(s).`);
  }

  // 2. Fetch any missing tweets individually
  for (const item of validHistory) {
    const id = String(item.id);
    if (!metricMap.has(id)) {
      console.log(`[tracker] Fetching status page for post ${id}...`);
      const statusHtml = await fetchHtmlWithRetry(`https://x.com/i/status/${id}`);
      if (statusHtml) {
        const statusMetrics = parseTweetMetricsFromHtml(statusHtml);
        const metrics = statusMetrics.get(id) || {
          views: 0,
          likes: 0,
          retweets: 0,
          replies: 0,
          bookmarks: 0,
        };
        metricMap.set(id, metrics);
      }
      // Small pause to be gentle with rate limits
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  // 3. Assemble PostMetric array
  const posts: PostMetric[] = validHistory.map((item) => {
    const id = String(item.id);
    const m = metricMap.get(id) || {
      views: 0,
      likes: 0,
      retweets: 0,
      replies: 0,
      bookmarks: 0,
    };

    return {
      id,
      pillar: item.pillar,
      postedAt: item.postedAt,
      text: item.text,
      views: m.views,
      likes: m.likes,
      retweets: m.retweets,
      replies: m.replies,
      bookmarks: m.bookmarks,
      url: `https://x.com/apurvsinghal28/status/${id}`,
    };
  });

  // Sort newest first
  posts.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  // 4. Calculate Summary Aggregates
  const totalPostsTracked = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalRetweets = posts.reduce((sum, p) => sum + p.retweets, 0);
  const totalReplies = posts.reduce((sum, p) => sum + p.replies, 0);
  const totalBookmarks = posts.reduce((sum, p) => sum + p.bookmarks, 0);
  const avgViewsPerPost =
    totalPostsTracked > 0 ? Math.round((totalViews / totalPostsTracked) * 10) / 10 : 0;

  const topPost = [...posts].sort((a, b) => b.views - a.views)[0];

  const report: AnalyticsReport = {
    summary: {
      trackedAt: new Date().toISOString(),
      totalPostsTracked,
      totalViews,
      totalLikes,
      totalRetweets,
      totalReplies,
      totalBookmarks,
      avgViewsPerPost,
      topPostByViews: topPost
        ? {
            id: topPost.id,
            views: topPost.views,
            pillar: topPost.pillar,
            text: topPost.text.slice(0, 100) + "...",
          }
        : undefined,
    },
    posts,
  };

  return report;
}

export function saveAnalyticsReport(report: AnalyticsReport, outputPath: string = ANALYTICS_PATH): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`[tracker] Saved analytics report to ${outputPath}`);
}

export function appendAnalyticsStepSummary(report: AnalyticsReport): void {
  if (!process.env.GITHUB_STEP_SUMMARY) return;
  try {
    const { summary, posts } = report;
    let md = `## 📊 X Weekly Analytics & Engagement Report\n\n`;
    md += `*Updated at: ${new Date(summary.trackedAt).toUTCString()}*\n\n`;
    md += `| Metric | Value |\n`;
    md += `| :--- | :--- |\n`;
    md += `| **Total Posts Tracked** | \`${summary.totalPostsTracked}\` |\n`;
    md += `| **Total Impressions (Views)** | \`${summary.totalViews}\` |\n`;
    md += `| **Total Likes** | \`${summary.totalLikes}\` |\n`;
    md += `| **Total Reposts** | \`${summary.totalRetweets}\` |\n`;
    md += `| **Total Replies** | \`${summary.totalReplies}\` |\n`;
    md += `| **Total Bookmarks** | \`${summary.totalBookmarks}\` |\n`;
    md += `| **Average Views / Post** | \`${summary.avgViewsPerPost}\` |\n\n`;

    if (summary.topPostByViews) {
      md += `### 🏆 Top Post by Views\n`;
      md += `- **Pillar:** ${summary.topPostByViews.pillar}\n`;
      md += `- **Views:** ${summary.topPostByViews.views}\n`;
      md += `- **Link:** [View on X](https://x.com/apurvsinghal28/status/${summary.topPostByViews.id})\n`;
      md += `> ${summary.topPostByViews.text}\n\n`;
    }

    md += `### 📝 All Posts Breakdown\n\n`;
    md += `| Date | Pillar | Views | Likes | Reposts | Replies | Bookmarks | Post |\n`;
    md += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n`;
    for (const p of posts) {
      const dateStr = p.postedAt.slice(0, 10);
      const shortText = p.text.slice(0, 50).replace(/\n/g, " ") + "...";
      md += `| ${dateStr} | ${p.pillar} | **${p.views}** | ${p.likes} | ${p.retweets} | ${p.replies} | ${p.bookmarks} | [${shortText}](${p.url}) |\n`;
    }

    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md, "utf-8");
  } catch {
    // Ignore step summary errors
  }
}

export async function runTracker(): Promise<void> {
  console.log("==========================================");
  console.log("📈 APURV SINGHAL · X ENGAGEMENT TRACKER");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("==========================================");

  try {
    const report = await collectXAnalytics();
    saveAnalyticsReport(report);
    appendAnalyticsStepSummary(report);

    console.log("\n--- Engagement Overview ---");
    console.log(`Total Posts: ${report.summary.totalPostsTracked}`);
    console.log(`Total Views: ${report.summary.totalViews}`);
    console.log(`Total Likes: ${report.summary.totalLikes}`);
    console.log(`Avg Views/Post: ${report.summary.avgViewsPerPost}`);
    if (report.summary.topPostByViews) {
      console.log(`Top Post: "${report.summary.topPostByViews.text}" (${report.summary.topPostByViews.views} views)`);
    }
    console.log("==========================================\n");
  } catch (err) {
    console.error("[tracker] Fatal error collecting analytics:", err);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith("tracker.ts")) {
  runTracker();
}
