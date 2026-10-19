import { formatDate } from "@/lib/format";

test("formats a calendar date in long British style", () => {
  expect(formatDate("2026-10-05")).toBe("5 October 2026");
});
