import { Badge } from "@/components/ui/badge";

const skillGroups = [
  {
    category: "AI & Agents",
    skills: [
      "Claude API",
      "OpenAI",
      "LangChain",
      "RAG",
      "Vector Databases",
      "MCP",
      "Prompt Engineering",
      "AI Agents",
      "Structured Outputs",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    skills: [
      "Azure",
      "Azure OpenAI",
      "Azure AI Foundry",
      "Vercel",
      "Serverless",
      "Cloud Architecture",
    ],
  },
  {
    category: "Backend & APIs",
    skills: [
      ".NET / ASP.NET Core",
      "C#",
      "Node.js",
      "TypeScript",
      "REST APIs",
      "SQL Server",
      "Microservices",
    ],
  },
  {
    category: "Frontend & Mobile",
    skills: ["Next.js", "React Native", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Engineering Practices",
    skills: [
      "CI/CD",
      "System Architecture",
      "Technical Mentoring",
      "Code Review",
      "Agile",
    ],
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
          Core tools and practices across AI engineering, cloud infrastructure,
          and full-stack development.
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
