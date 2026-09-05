import { Badge } from "@/components/ui/badge";

const skillGroups = [
  {
    category: "Azure Cloud + DevOps",
    skills: [
      "Microsoft Azure",
      "CI/CD Pipelines",
      "GitHub Actions",
      "Docker",
      "Terraform / Bicep",
      "Azure Functions (Serverless)",
      "Telemetry & Log Analytics",
      "Cloud Cost Optimization",
    ],
  },
  {
    category: "Platform Engineering",
    skills: [
      "Platform Migration",
      "Enterprise Landing Zones",
      "Developer Platform Velocity",
      "Infrastructure as Code",
      "Microservices Architecture",
      "Zero-Trust & Security",
      "SRE & Reliability",
      "System Design",
    ],
  },
  {
    category: "Applied AI & Agents",
    skills: [
      "Azure AI Foundry",
      "Azure OpenAI",
      "AI Agents",
      "Claude API",
      "RAG Architectures",
      "Vector Databases",
      "Model Context Protocol (MCP)",
      "APP 1.7 Compliance",
      "Structured Outputs",
    ],
  },
  {
    category: "Backend & Systems",
    skills: [
      ".NET / ASP.NET Core",
      "C#",
      "TypeScript",
      "Node.js",
      "Python SDKs",
      "REST APIs",
      "SQL Server",
      "Azure Cosmos DB",
    ],
  },
  {
    category: "Engineering Leadership",
    skills: [
      "Technical Mentoring",
      "Architecture Governance",
      "Cross-functional Leadership",
      "Code Review & Standards",
      "Agile Delivery",
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
          Core technical competencies across Azure Cloud + DevOps, Platform Engineering,
          Applied AI systems, and enterprise architectures.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] p-5 hover:border-primary/40 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-[border-color,box-shadow] duration-200"
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
