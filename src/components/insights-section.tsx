import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import rawHistory from "../../content/x-history.json";

interface HistoryItem {
  id: string;
  pillar: string;
  text: string;
  source: string;
  postedAt: string;
}

export function InsightsSection() {
  const history = (rawHistory as HistoryItem[])
    .filter((item) => /^\d{15,25}$/.test(String(item.id)))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 3);

  if (history.length === 0) {
    return null;
  }

  return (
    <section id="insights" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="motion-safe:animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Daily Technical Notes
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Real-world insights on Azure governance, platform engineering, AI guardrails, and enterprise architecture—published daily to X.
            </p>
          </div>

          <Link
            href="https://x.com/apurvsinghal28"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>Follow on X</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {history.map((post) => {
            const dateStr = new Date(post.postedAt).toLocaleDateString("en-AU", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] p-6 hover:border-primary/40 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-[border-color,box-shadow] duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-0 text-[11px] font-medium"
                    >
                      {post.pillar}
                    </Badge>
                    <time
                      dateTime={post.postedAt}
                      className="text-xs text-muted-foreground"
                    >
                      {dateStr}
                    </time>
                  </div>

                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-normal mb-6">
                    {post.text}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary/70" />
                    <span>Verified Production Insight</span>
                  </span>
                  <Link
                    href={`https://x.com/apurvsinghal28/status/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground group-hover:text-primary transition-colors"
                  >
                    <span>Discuss on X</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
