import { render, screen, fireEvent } from "@testing-library/react";
import { ResumeView } from "@/app/resume/resume-view";

describe("ResumeView", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders personal header and core pillars", () => {
    render(<ResumeView />);

    expect(screen.getByRole("heading", { name: "Apurv Singhal", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Lead Cloud & Platform Consultant · AI Engineer · Founder")).toBeInTheDocument();
    expect(screen.getByText("Azure Cloud + DevOps")).toBeInTheDocument();
    expect(screen.getAllByText("Platform Engineering").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Capgemini, IndianCare Inc., and ADM Guard", () => {
    render(<ResumeView />);

    // Professional experience
    expect(screen.getByText(/Lead Consultant \(Azure Cloud, DevOps & Platform\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Capgemini/i).length).toBeGreaterThanOrEqual(1);

    // Volunteer leadership
    expect(screen.getByText(/Head of IT \(Volunteer\)/i)).toBeInTheDocument();
    expect(screen.getByText(/IndianCare Inc\./i)).toBeInTheDocument();

    // Commercial venture
    expect(screen.getByRole("heading", { name: "ADM Guard", level: 3 })).toBeInTheDocument();
  });

  it("triggers window.print when Download or Print button is clicked", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

    render(<ResumeView />);

    const downloadBtn = screen.getByRole("button", { name: /download \/ save as pdf/i });
    fireEvent.click(downloadBtn);
    expect(printSpy).toHaveBeenCalledTimes(1);

    const printBtn = screen.getByRole("button", { name: /^print$/i });
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalledTimes(2);
  });

  it("has a link back to the portfolio home", () => {
    render(<ResumeView />);

    const backLink = screen.getByRole("link", { name: /back to portfolio/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});
