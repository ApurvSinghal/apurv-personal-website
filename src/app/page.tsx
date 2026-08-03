import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { Footer } from "@/components/footer";
import { HomeEnhancements } from "@/components/home-enhancements";

const ProjectsSection = dynamic(
  () => import("@/components/projects-section").then((m) => m.ProjectsSection),
);
const ContactSection = dynamic(
  () => import("@/components/contact-section").then((m) => m.ContactSection),
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(40%_35%_at_85%_10%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%),radial-gradient(35%_30%_at_10%_55%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_72%),radial-gradient(28%_24%_at_78%_88%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_78%)]"
        aria-hidden
      />

      <HomeEnhancements />
      <Header />
      <main id="main-content">
        <HeroSection />
        <div data-animate>
          <ExperienceSection />
        </div>
        <div data-animate>
          <SkillsSection />
        </div>
        <div data-animate>
          <ProjectsSection />
        </div>
        <div data-animate>
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
