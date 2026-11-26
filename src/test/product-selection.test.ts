import { describe, expect, it, vi } from "vitest";
import { directProductDestination, openProductDestination } from "@/lib/product-selection";

describe("GoBolig product selection", () => {
  it("sends contents insurance directly to the LEA price calculator", () => {
    expect(directProductDestination("gobolig", "indbo")).toBe("https://leaforsikring.dk/forsikring/indbo/beregn#beregner");
  });
  it("keeps the existing input step for other insurance products", () => {
    expect(directProductDestination("gobolig", "husleje")).toBeNull();
    expect(directProductDestination("gobolig", "ulykke")).toBeNull();
  });
  it("does not change other partners", () => {
    expect(directProductDestination("jeudan", "indbo")).toBeNull();
  });
  it("opens the calculator outside the embedded preview without opener access", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    try {
      openProductDestination("https://leaforsikring.dk/forsikring/indbo/beregn#beregner");
      expect(open).toHaveBeenCalledWith(
        "https://leaforsikring.dk/forsikring/indbo/beregn#beregner",
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      open.mockRestore();
    }
  });
});