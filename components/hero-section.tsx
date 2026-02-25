import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/apurvsinghal28", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@apurvsinghal.com", label: "Email" },
];

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
              Software Engineer
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xs">
              I build accessible, pixel-perfect digital experiences for the web.
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
              I&apos;m a developer passionate about crafting accessible,
              pixel-perfect user interfaces that blend thoughtful design with
              robust engineering. My favorite work lies at the intersection of
              design and development, creating experiences that not only look
              great but are meticulously built for performance and usability.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Currently, I&apos;m focused on building scalable web applications
              and contributing to open-source projects. I specialize in{" "}
              <span className="text-foreground font-medium">React</span>,{" "}
              <span className="text-foreground font-medium">TypeScript</span>,
              and <span className="text-foreground font-medium">Node.js</span>,
              with a strong foundation in system design and cloud
              infrastructure.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              In the past, I&apos;ve had the opportunity to develop software
              across a variety of settings — from{" "}
              <span className="text-foreground font-medium">startups</span> and{" "}
              <span className="text-foreground font-medium">
                large corporations
              </span>{" "}
              to{" "}
              <span className="text-foreground font-medium">
                freelance projects
              </span>
              . Each experience has shaped my approach to building software that
              truly serves its users.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              When I&apos;m not coding, you&apos;ll find me exploring new
              technologies, reading about system architecture, or contributing
              to developer communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
