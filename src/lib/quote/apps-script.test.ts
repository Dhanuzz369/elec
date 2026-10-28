import { createRequire } from "node:module";

// The Apps Script helpers are plain script (no imports) so the same file can be
// pasted into the Power sheet; Node loads it through require.
const require = createRequire(import.meta.url);
const { COLUMNS, alertsDue, escapeCell, isLeadId, mergeRow, parseRequest } = require("../../../apps-script/Sheet.js");

const col = (row: string[], name: string) => row[COLUMNS.indexOf(name)];

describe("escapeCell", () => {
  test("prefixes anything Sheets would run as a formula", () => {
    for (const v of ["=SUM(A1)", "+1", "-x", "@x", "\tx", "\rx"]) expect(escapeCell(v)).toBe(`'${v}`);
  });
  test("trims and caps", () => {
    expect(escapeCell("  ok ")).toBe("ok");
    expect(escapeCell("a".repeat(2500))).toHaveLength(2000);
    expect(escapeCell(undefined)).toBe("");
  });
  test("a value that is only a formula after trimming is still escaped", () => {
    expect(escapeCell("  =1+1")).toBe("'=1+1");
  });
});

describe("mergeRow", () => {
  const first = mergeRow(null, { leadId: "L", stage: "contact", name: "Ali" }, "T1");

  test("a new row stamps firstSeen and updated", () => {
    expect(col(first, "leadId")).toBe("L");
    expect(col(first, "firstSeen")).toBe("T1");
    expect(col(first, "updated")).toBe("T1");
  });

  test("later sends keep filled cells and firstSeen", () => {
    const next = mergeRow(first, { leadId: "L", stage: "product", name: "", product: "LT panels" }, "T2");
    expect(col(next, "name")).toBe("Ali");
    expect(col(next, "product")).toBe("LT panels");
    expect(col(next, "firstSeen")).toBe("T1");
    expect(col(next, "updated")).toBe("T2");
  });

  test("stage only moves forward", () => {
    const done = mergeRow(first, { leadId: "L", stage: "submitted" }, "T2");
    expect(col(mergeRow(done, { leadId: "L", stage: "quantity" }, "T3"), "stage")).toBe("submitted");
  });

  test("incoming cannot set the alert record, timestamps or unknown stages", () => {
    const row = mergeRow(first, { leadId: "L", stage: "bogus", alerted: "contact,submitted", firstSeen: "X" }, "T2");
    expect(col(row, "alerted")).toBe("");
    expect(col(row, "firstSeen")).toBe("T1");
    expect(col(row, "stage")).toBe("contact");
  });

  test("values are escaped on the way in", () => {
    expect(col(mergeRow(null, { leadId: "L", stage: "contact", name: "=HYPERLINK(1)" }, "T"), "name")).toBe("'=HYPERLINK(1)");
  });
});

describe("alertsDue", () => {
  const row = (stage: string, alerted = "") => {
    const r = mergeRow(null, { leadId: "L", stage }, "T");
    r[COLUMNS.indexOf("alerted")] = alerted;
    return r;
  };
  test("new lead", () => expect(alertsDue(row("contact"))).toEqual(["contact"]));
  test("nothing new mid-form", () => expect(alertsDue(row("terms", "contact"))).toEqual([]));
  test("finished request", () => expect(alertsDue(row("submitted", "contact"))).toEqual(["submitted"]));
  test("straight to submitted sends one email", () => expect(alertsDue(row("submitted"))).toEqual(["submitted"]));
});

describe("parseRequest", () => {
  test("JSON body", () => {
    expect(parseRequest({ postData: { contents: '{"leadId":"L"}' }, parameter: {} })).toEqual({ data: { leadId: "L" }, form: false });
  });
  test("form-encoded body (no JavaScript)", () => {
    expect(parseRequest({ parameter: { name: "A" }, postData: { contents: "name=A" } })).toEqual({ data: { name: "A" }, form: true });
  });
  test("JSON that is not an object falls back to the form", () => {
    expect(parseRequest({ parameter: {}, postData: { contents: "42" } }).form).toBe(true);
  });
});

test("cells read back from the sheet are escaped again before writing", () => {
  // getDisplayValues drops the apostrophe, so a stored "'=1+1" comes back as "=1+1".
  const existing = mergeRow(null, { leadId: "L", stage: "contact" }, "T1");
  existing[COLUMNS.indexOf("company")] = "=1+1";
  expect(col(mergeRow(existing, { leadId: "L", stage: "product" }, "T2"), "company")).toBe("'=1+1");
});

test("lead ids must look like ids, so a post cannot target the header row", () => {
  expect(isLeadId("0b8a3f0e-5c1d-4c1e-9a77-2f3d1c9e8b10")).toBe(true);
  expect(isLeadId("lq3x9k-4f8a2b1c9d")).toBe(true);
  expect(isLeadId("leadId")).toBe(false);
  expect(isLeadId("=A1")).toBe(false);
  expect(isLeadId("")).toBe(false);
  expect(isLeadId("a".repeat(100))).toBe(false);
});
