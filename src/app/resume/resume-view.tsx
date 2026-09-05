"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer, ExternalLink, Globe, Mail, MapPin } from "lucide-react";
import { RESUME_DATA } from "@/lib/resume-data";

export function ResumeView() {
  useEffect(() => {
    // If URL has ?download=true or ?print=true, automatically open the print dialog
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("download") === "true" || params.get("print") === "true") {
        setTimeout(() => {
          window.print();
        }, 400);
      }
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Group experiences by company for clear promotion and tenure hierarchy
  const groupedExperience = [
    {
      company: "Capgemini",
      period: "2021 — Present",
      companyUrl: "https://www.capgemini.com",
      roles: RESUME_DATA.experience.filter((e) => e.company === "Capgemini"),
    },
    {
      company: "Willow.ai",
      period: "2020 — 2021",
      companyUrl: "https://www.willowinc.com",
      roles: RESUME_DATA.experience.filter((e) => e.company === "Willow.ai"),
    },
    {
      company: "TechCompiler Data Systems",
      period: "2018 — 2020",
      companyUrl: "https://www.techcompiler.com",
      roles: RESUME_DATA.experience.filter((e) => e.company === "TechCompiler Data Systems"),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 text-foreground py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
      {/* Top Action Toolbar (Hidden in Print) */}
      <aside aria-label="Resume Actions" className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="bg-background/90 backdrop-blur-md border border-border/80 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Portfolio
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              title="Print directly to your printer"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow cursor-pointer"
              title="Save as a high-fidelity vector PDF via browser print"
            >
              <Download size={14} />
              Download / Save as PDF
            </button>
          </div>
        </div>
      </aside>

      {/* Main Resume Document Sheet */}
      <main className="max-w-4xl mx-auto bg-card text-card-foreground border border-border/60 rounded-xl shadow-xl p-6 sm:p-12 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:bg-white print:text-black">
        {/* Header */}
        <header className="border-b border-border/80 pb-5 print:pb-3 print:border-black/20">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground print:text-black print:text-3xl">
              {RESUME_DATA.name}
            </h1>
            <p className="text-sm font-semibold text-primary print:text-neutral-800">
              {RESUME_DATA.title}
            </p>
          </div>

          {/* Contact Strip: 2 Clean, Balanced Lines */}
          <div className="mt-2.5 text-xs text-muted-foreground print:text-neutral-700 space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} className="print:hidden text-primary" />
                {RESUME_DATA.location}
              </span>
              <span className="text-border print:text-neutral-400">•</span>
              <a
                href={`mailto:${RESUME_DATA.email}`}
                className="inline-flex items-center gap-1 hover:text-foreground print:text-black hover:underline"
              >
                <Mail size={11} className="print:hidden text-primary" />
                {RESUME_DATA.email}
              </a>
              <span className="text-border print:text-neutral-400">•</span>
              <a
                href={RESUME_DATA.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground print:text-black hover:underline font-medium text-foreground print:text-black"
              >
                <Globe size={11} className="print:hidden text-primary" />
                apurvsinghal.com
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href={RESUME_DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground print:text-black hover:underline"
              >
                linkedin.com/in/apurvsinghal28
              </a>
              <span className="text-border print:text-neutral-400">•</span>
              <a
                href={RESUME_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground print:text-black hover:underline"
              >
                github.com/ApurvSinghal
              </a>
              <span className="text-border print:text-neutral-400">•</span>
              <a
                href="https://www.admguard.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground print:text-black hover:underline font-medium text-foreground print:text-black"
              >
                admguard.com.au
              </a>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 print:mt-2">
            <span className="text-xs font-semibold text-foreground print:text-black mr-1">
              Core Focus:
            </span>
            {RESUME_DATA.pillars.map((pillar) => (
              <span
                key={pillar}
                className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary print:bg-neutral-100 print:text-black print:border print:border-neutral-300"
              >
                {pillar}
              </span>
            ))}
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mt-6 print:mt-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-2 print:mb-1">
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground print:text-neutral-700">
            {RESUME_DATA.summary}
          </p>
        </section>

        {/* Professional Experience (Grouped by Company for Promotion & Retention) */}
        <section className="mt-7 print:mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-3 print:mb-2 border-b border-border/40 pb-1 print:border-black/20">
            Professional Experience
          </h2>

          <div className="space-y-5 print:space-y-3.5">
            {groupedExperience.map((group, gIdx) => (
              <div key={gIdx} className="break-inside-avoid">
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1 border-b border-border/30 print:border-black/15">
                  <h3 className="text-sm font-bold text-foreground print:text-black">
                    {group.company}
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground print:text-neutral-600 tabular-nums">
                    {group.period}
                  </span>
                </div>

                {/* Sub-Roles */}
                <div className="mt-2 space-y-3 print:space-y-2.5 sm:pl-2">
                  {group.roles.map((role, rIdx) => (
                    <div key={rIdx} className="break-inside-avoid">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h4 className="text-xs font-semibold text-foreground print:text-black">
                          {role.role}
                        </h4>
                        <div className="text-[11px] font-mono text-muted-foreground print:text-neutral-600 tabular-nums">
                          {role.period} | {role.location}
                        </div>
                      </div>

                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground print:text-neutral-700 list-disc list-outside pl-4 leading-relaxed">
                        {role.highlights.map((item, hIdx) => (
                          <li key={hIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community & Pro Bono Leadership */}
        <section className="mt-7 print:mt-4 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-3 print:mb-2 border-b border-border/40 pb-1 print:border-black/20">
            Community & Pro Bono Leadership
          </h2>

          <div className="space-y-3 print:space-y-2">
            {RESUME_DATA.volunteer.map((item, idx) => (
              <div key={idx} className="break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground print:text-black inline-flex items-center gap-1.5">
                      {item.role}
                      <span className="font-normal text-muted-foreground print:text-neutral-600">
                        · {item.organization}
                      </span>
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground print:text-neutral-600 tabular-nums">
                    {item.period} | {item.location}
                  </div>
                </div>

                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground print:text-neutral-700 list-disc list-outside pl-4 leading-relaxed">
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Key Products & Architectures */}
        <section className="mt-7 print:mt-4 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-3 print:mb-2 border-b border-border/40 pb-1 print:border-black/20">
            Featured Commercial Venture & Systems
          </h2>

          <div className="space-y-4 print:space-y-3">
            {RESUME_DATA.projects.map((proj, idx) => (
              <div key={idx} className="break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground print:text-black">
                      {proj.name}
                    </h3>
                    <span className="text-xs text-muted-foreground print:text-neutral-600">
                      ({proj.role})
                    </span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs inline-flex items-center gap-0.5 print:hidden"
                      >
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-0.5 text-xs font-medium text-foreground print:text-neutral-800">
                  {proj.description}
                </p>

                <ul className="mt-1 space-y-1 text-xs text-muted-foreground print:text-neutral-700 list-disc list-outside pl-4 leading-relaxed">
                  {proj.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Competencies Matrix */}
        <section className="mt-7 print:mt-4 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-3 print:mb-2 border-b border-border/40 pb-1 print:border-black/20">
            Technical Competencies & Tooling
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
            {RESUME_DATA.skills.map((skillGroup, idx) => (
              <div key={idx} className="text-xs break-inside-avoid">
                <span className="font-semibold text-foreground print:text-black block mb-0.5">
                  {skillGroup.category}:
                </span>
                <p className="text-muted-foreground print:text-neutral-700 leading-relaxed">
                  {skillGroup.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mt-7 print:mt-4 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary print:text-black mb-3 print:mb-2 border-b border-border/40 pb-1 print:border-black/20">
            Education & Certifications
          </h2>

          <div className="space-y-2.5 text-xs">
            {RESUME_DATA.education.map((edu, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-semibold text-foreground print:text-black">
                    {edu.degree}
                  </span>
                  <span className="text-muted-foreground print:text-neutral-600">
                    {" "}— {edu.institution}
                  </span>
                </div>
                <div className="font-mono text-muted-foreground print:text-neutral-600 tabular-nums">
                  {edu.period}
                </div>
              </div>
            ))}

            <div className="pt-1">
              <span className="font-semibold text-foreground print:text-black block mb-0.5">
                Industry Certifications:
              </span>
              <p className="text-muted-foreground print:text-neutral-700">
                {RESUME_DATA.certifications.join(" · ")}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Embedded Print CSS Rules for ATS Perfection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm 12mm 10mm 12mm;
              }
              html, body {
                background-color: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              a {
                text-decoration: none !important;
                color: #000000 !important;
              }
              .break-inside-avoid {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
          `,
        }}
      />
    </div>
  );
}
