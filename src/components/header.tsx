"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { navItems } from "@/lib/constants";
import { useActiveSection } from "@/hooks/use-active-section";

const sectionIds = navItems
  .map((item) => item.href.replace("#", ""))
  .filter(Boolean);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const activeSection = useActiveSection(sectionIds);
  const mobileMenuId = "mobile-navigation-menu";

  useEffect(() => {
    let frameRequested = false;

    const onScroll = () => {
      if (frameRequested) {
        return;
      }

      frameRequested = true;
      window.requestAnimationFrame(() => {
        frameRequested = false;
        const nextScrolled = window.scrollY > 10;
        setScrolled((previous) =>
          previous === nextScrolled ? previous : nextScrolled,
        );
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((previous) => !previous);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/60 dark:bg-background/50 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/5 dark:shadow-black/20" : ""
      }`}
    >
      <nav className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/icon.svg"
              alt="Apurv Singhal Logo"
              width={32}
              height={32}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span>Apurv Singhal</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/resume"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Resume
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            <Sun size={20} className="hidden dark:block" />
            <Moon size={20} className="block dark:hidden" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id={mobileMenuId}
          className="md:hidden bg-background border-b border-border"
        >
          <ul className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/resume"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                Resume
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
