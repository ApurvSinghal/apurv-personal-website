import { Cloud, Layers, Bot, Database, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const skillGroups = [
  {
    category: "Azure Cloud + DevOps",
    icon: Cloud,
    skills: [
      "Microsoft Azure",
      "Azure Integration Services (APIM, Logic Apps)",
      "Azure Container Apps & Tanzu",
      "CI/CD (Azure DevOps & GitHub Actions)",
      "Terraform / Bicep IaC",
      "Full-Stack Observability (New Relic, Dynatrace)",
      "Azure Functions (Serverless)",
      "Cloud Cost Governance & FinOps",
    ],
  },
  {
    category: "Platform Engineering",
    icon: Layers,
    skills: [
      "Enterprise Platform Modernization",
      "Internal Developer Platforms & Golden Paths",
      "Salesforce DevOps (SFDX)",
      "Azure Policy-as-Code & Guardrails",
      "Microservices Architecture",
      "Zero-Downtime Release Automation",
      "SRE & Reliability Metrics (MTTD/MTTR)",
      "System Design",
    ],
  },
  {
    category: "Applied AI & Agents",
    icon: Bot,
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
    icon: Database,
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
    icon: Users,
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
          Core technical competencies across Azure Cloud + DevOps, Platform
          Engineering, Applied AI systems, and enterprise architectures.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, idx) => {
            const Icon = group.icon;
            const isFullWidthOnTablet =
              idx === 4 ? "sm:col-span-2 lg:col-span-1" : "";

            return (
              <div
                key={group.category}
                className={`rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/50 p-5 hover:border-primary/40 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-[border-color,box-shadow,background-color] duration-200 flex flex-col justify-between ${isFullWidthOnTablet}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={15} className="text-primary shrink-0" />
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {group.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-secondary/80 text-secondary-foreground hover:bg-secondary border-0 text-xs py-0.5 px-2"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
