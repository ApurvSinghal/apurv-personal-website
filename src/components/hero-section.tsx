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
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-primary/25 dark:bg-primary/20 blur-[80px] pointer-events-none" aria-hidden />
            <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Apurv Singhal
            </h1>
            <p className="mt-3 text-xl text-primary font-medium">
              Lead Consultant at Capgemini
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Cloud & DevOps · .NET · Mobile · Japanese N5
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
              I&apos;m a passionate technology professional with a strong focus on{" "}
              <span className="text-foreground font-medium">Azure Cloud</span>,{" "}
              <span className="text-foreground font-medium">Azure DevOps</span>,{" "}
              <span className="text-foreground font-medium">.NET</span> software development,
              and mobile application creation. My goal is to build scalable, high-performing
              solutions that deliver measurable results for clients and teams alike.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Currently based in{" "}
              <span className="text-foreground font-medium">Melbourne, Australia</span>,
              I lead Azure cloud initiatives at Capgemini, optimizing resource utilization
              and performance while enhancing CI/CD pipelines to reduce deployment time.
              I&apos;m committed to mentoring junior developers and fostering knowledge-sharing
              within my teams.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              My expertise includes designing and optimizing{" "}
              <span className="text-foreground font-medium">cloud architecture</span> for
              performance, security, and cost efficiency, crafting robust{" "}
              <span className="text-foreground font-medium">CI/CD pipelines</span>, and
              building secure, maintainable applications. I also develop responsive,
              user-centric mobile apps for diverse platforms.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              I believe that combining technical expertise with a proactive mindset is the
              key to delivering exceptional outcomes. I&apos;m committed to staying ahead of
              emerging tech trends and fostering collaboration and innovation within my teams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
