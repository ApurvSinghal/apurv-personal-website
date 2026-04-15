import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const CONTACT_EMAIL = "admin@apurvsinghal.com";

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks = [
  { icon: Github, href: "https://github.com/ApurvSinghal", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/apurvsinghal28", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/apurvsinghal28", label: "X (Twitter)" },
  { icon: Mail, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
];
