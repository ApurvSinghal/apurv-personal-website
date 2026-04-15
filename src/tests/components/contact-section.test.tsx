import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSection } from "@/components/contact-section";

describe("ContactSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows success state after successful submit", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "ok" }), { status: 200 }),
    );

    render(<ContactSection />);

    await userEvent.type(screen.getByLabelText("Name"), "Apurv");
    await userEvent.type(screen.getByLabelText("Email"), "apurv@example.com");
    await userEvent.type(screen.getByLabelText("Message"), "Hello there");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Thanks for reaching out!")).toBeInTheDocument();
    });
  });

  it("surfaces API error message", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 503 }),
    );

    render(<ContactSection />);

    await userEvent.type(screen.getByLabelText("Name"), "Apurv");
    await userEvent.type(screen.getByLabelText("Email"), "apurv@example.com");
    await userEvent.type(screen.getByLabelText("Message"), "Hello there");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });
});
