import type { Metadata } from "next";
import { ResumeView } from "./resume-view";

export const metadata: Metadata = {
  title: "Resume · Apurv Singhal | Lead Cloud & Platform Consultant",
  description:
    "Executive and ATS-compliant resume of Apurv Singhal — Lead Consultant at Capgemini, Founder of ADM Guard, and Head of IT (Volunteer) at IndianCare Inc. Specializing in Azure Cloud, DevOps, Platform Engineering, and Applied AI.",
  alternates: {
    canonical: "https://www.apurvsinghal.com/resume",
  },
  openGraph: {
    title: "Resume · Apurv Singhal | Lead Cloud & Platform Consultant",
    description:
      "Executive and ATS-compliant resume of Apurv Singhal — Lead Consultant at Capgemini, Founder of ADM Guard, and Head of IT (Volunteer) at IndianCare Inc.",
    url: "https://www.apurvsinghal.com/resume",
    type: "profile",
  },
};

export default function ResumePage() {
  return <ResumeView />;
}
