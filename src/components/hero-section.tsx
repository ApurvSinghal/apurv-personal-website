import Link from "next/link";
import { MapPin, FileText } from "lucide-react";
import { socialLinks } from "@/lib/constants";
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
              Azure Cloud & Platform Architect · AI Engineer · Founder of ADM
              Guard
            </p>

            {/* Availability Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to permanent & consulting roles
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={12} />
              Melbourne, Australia
            </div>

            {/* Download CV */}
            <div className="mt-6">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors"
              >
                <FileText size={16} />
                Download CV
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-5">
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
          <div id="about" className="scroll-mt-28 space-y-6">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {
                "Most enterprise platforms don't fail from lack of code; they fail from deployment friction, unobservable distributed systems, and compliance debt. I'm an enterprise cloud & platform architect with "
              }
              {`${getYearsOfExperience()}+ years shipping mission-critical systems across `}
              <span className="text-foreground font-medium">
                Azure Cloud + DevOps
              </span>
              {", "}
              <span className="text-foreground font-medium">
                Platform Engineering
              </span>
              {", and "}
              <span className="text-foreground font-medium">Applied AI</span>
              {". Currently Lead Consultant at Capgemini and Founder of "}
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
            <p className="text-muted-foreground leading-relaxed text-lg">
              {
                "Over my career, I've architected cloud platforms and full-stack telemetry across regulated banking, energy, and automotive environments—from monitoring 10,000+ microservices and endpoints at Bank of Queensland and modernizing container platforms at Toyota Australia, to cutting environment setup from days to under 30 minutes at EPA Victoria."
              }
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {
                "Beyond enterprise consulting, I serve as Head of IT (Volunteer) for "
              }
              <Link
                href="https://www.indiancare.org.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                IndianCare Inc.
              </Link>
              {
                ", managing digital infrastructure for Victorian community welfare. If you're planning your next cloud, platform, or AI milestone, let's talk."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
