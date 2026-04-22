import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
      expect(screen.getByRole("status")).toBeInTheDocument();
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
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true");
  });

  it("cleans up copy email timeout on unmount", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });

    const { unmount } = render(<ContactSection />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /copy email address/i }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });
});
