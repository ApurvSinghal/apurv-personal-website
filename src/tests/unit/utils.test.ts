import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges classes and resolves Tailwind conflicts", () => {
    const result = cn("px-2", "px-4", "text-sm", "font-medium");
    expect(result).toContain("px-4");
    expect(result).toContain("text-sm");
    expect(result).toContain("font-medium");
    expect(result).not.toContain("px-2");
  });
});
