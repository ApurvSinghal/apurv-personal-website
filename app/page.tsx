import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <KeyboardShortcuts />
      <Header />
      <main>
        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
