import Link from "next/link";
import { socialLinks } from "@/lib/constants";
import { addBrowserPageAction } from "@/lib/newrelic-browser";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Apurv Singhal. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  addBrowserPageAction("SocialLinkClicked", {
                    label: social.label,
                    location: "footer",
                    target: social.href,
                  })
                }
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center sm:text-left">
          Built with Next.js and Tailwind CSS. Deployed on Vercel.
        </p>
      </div>
    </footer>
  );
}
