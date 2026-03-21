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
    <div className="min-h-screen bg-background relative">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
        <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full bg-primary/20 dark:bg-primary/15 blur-[140px]" />
        <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px]" />
      </div>

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
