import { Badge } from "@/components/ui/badge";

const skillGroups = [
  {
    category: "Cloud & DevOps",
    skills: [
      "Microsoft Azure",
      "Azure DevOps",
      "CI/CD Pipelines",
      "Cloud Architecture",
      "Infrastructure as Code",
      "Platform Migration",
    ],
  },
  {
    category: "Backend Development",
    skills: [
      ".NET / ASP.NET Core",
      "C#",
      "SQL Server",
      "REST APIs",
      "Microservices",
      "System Architecture",
    ],
  },
  {
    category: "Mobile & Frontend",
    skills: [
      "Mobile Development",
      "React Native",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    category: "Tools & Practices",
    skills: [
      "Git",
      "Agile / Scrum",
      "Technical Mentoring",
      "Code Review",
      "Azure Boards",
    ],
  },
  {
    category: "Languages",
    skills: ["C#", "TypeScript", "JavaScript", "SQL", "Japanese (N5)"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Skills
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed mb-12">
          Core technologies and practices I work with day-to-day, spanning cloud
          infrastructure, backend systems, mobile, and frontend development.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-md p-5 hover:border-primary/40 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300"
            >
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
