import Link from "next/link";
import { MapPin } from "lucide-react";
import { socialLinks, navItems } from "@/lib/constants";

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
              AI Engineer & Builder
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI Agents · Claude API · Azure AI · RAG
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
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
                  <Link
                    href="/documents/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all duration-300 mr-4" />
                    RESUME
                  </Link>
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
                "I'm an engineer with 6+ years shipping production systems at enterprise scale. I'm now going deep on "
              }
              <span className="text-foreground font-medium">AI</span>
              {
                " — building agents, automation, and AI-powered applications that solve real business problems."
              }
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {"Based in "}
              <span className="text-foreground font-medium">Melbourne</span>
              {
                ", I currently lead cloud initiatives at Capgemini. That background — shipping reliable systems at scale, navigating enterprise constraints, talking to stakeholders — is what I bring to AI work. Not just demos, but "
              }
              <span className="text-foreground font-medium">
                production-ready systems
              </span>
              {"."}
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {"My focus is on the applied side of AI: "}
              <span className="text-foreground font-medium">Claude API</span>
              {", "}
              <span className="text-foreground font-medium">RAG pipelines</span>
              {", "}
              <span className="text-foreground font-medium">
                agent workflows
              </span>
              {
                ", and Azure AI. I care about things that actually work in production: clear failure modes, observable systems, and measurable outcomes."
              }
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              {
                "If you have a problem that AI can solve — or you're not sure yet — I'm happy to talk through it."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
