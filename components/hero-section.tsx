import Link from "next/link";
import { socialLinks } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-16 items-start">
          {/* Left Column */}
          <div className="md:sticky md:top-28">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Apurv Singhal
            </h1>
            <p className="mt-3 text-xl text-primary font-medium">
              Software Developer at Capgemini
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xs">
              Cloud & DevOps Specialist | .NET & Mobile App Developer | Japanese Language N5 Proficient
            </p>

            {/* Navigation Links */}
            <nav className="mt-12 hidden md:block">
              <ul className="space-y-4">
                {["About", "Experience", "Projects", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all mr-4" />
                      {item.toUpperCase()}
                    </Link>
                  </li>
                ))}
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
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={22} />
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
