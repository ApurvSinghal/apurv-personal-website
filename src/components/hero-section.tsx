import Link from "next/link";
import { MapPin } from "lucide-react";
import { socialLinks, navItems } from "@/lib/constants";
import { getYearsOfExperience } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-16 items-start">
          {/* Left Column */}
          <div className="md:sticky md:top-28 relative">
            {/* Glow orb behind name */}
            <div
              className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-primary/25 dark:bg-primary/20 blur-[80px] pointer-events-none"
              aria-hidden
            />
            <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Apurv Singhal
            </h1>
            <p className="mt-3 text-xl text-primary font-medium">
              Azure Cloud + DevOps · Platform Engineer · AI
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Lead Consultant at Capgemini · Founder of ADM Guard · Enterprise Scale
            </p>

            {/* Availability Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for Cloud, Platform & AI Consulting
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={12} />
              Melbourne, Australia
            </div>

            {/* Navigation Links */}
            <nav className="mt-12 hidden md:block">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all duration-300 mr-4" />
                      {item.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/documents/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all duration-300 mr-4" />
                    RESUME
                  </a>
                </li>
              </ul>
            </nav>

            {/* Social Links */}
            <div className="mt-12 flex items-center gap-5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - About Content */}
          <div id="about" className="scroll-mt-28">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {
                `I'm an engineer with ${getYearsOfExperience()}+ years shipping production systems at enterprise scale. I currently lead cloud and platform initiatives at Capgemini, and I'm the founder of `
              }
              <Link
                href="https://www.admguard.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                ADM Guard
              </Link>
              {
                " — the compliance flight recorder for automated decisions (APP 1.7–1.9)."
              }
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {"My work centers on three core pillars: "}
              <span className="text-foreground font-medium">Azure Cloud + DevOps</span>
              {", "}
              <span className="text-foreground font-medium">Platform Engineering</span>
              {", and "}
              <span className="text-foreground font-medium">Applied AI</span>
              {
                ". That background — automating delivery pipelines, migrating mission-critical platforms, navigating enterprise governance, and designing resilient infrastructure — is what shapes everything I build."
              }
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {
                "Whether it's architecting cloud landing zones, driving internal developer velocity, implementing AI compliance gateways, or deploying production RAG and agent workflows, I care about systems that actually work in production: clear failure modes, observable architecture, and measurable business outcomes."
              }
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {
                "If you have a problem in Azure cloud, platform engineering, or AI systems — or you're planning your next architectural milestone — I'm happy to talk through it."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
