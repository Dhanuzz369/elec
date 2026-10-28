import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Runs apps-script/Code.gs against a small in-memory stand-in for the Apps
// Script services, so the order of writing and alerting can be tested.
function harness(opts: { mailFails?: boolean } = {}) {
  const rows: string[][] = [];
  const mail: { subject: string }[] = [];
  const range = (row: number, col: number, n: number) => ({
    getDisplayValues: () => [rows[row - 1]?.slice() ?? []],
    setNumberFormat() {
      return this;
    },
    setValues: (v: string[][]) => {
      const target = (rows[row - 1] ??= []);
      v[0].forEach((value, j) => (target[col - 1 + j] = value));
    },
    setValue: () => {},
    setFontWeight: () => {},
    createTextFinder: (id: string) => {
      const finder = {
        matchEntireCell: () => finder,
        matchCase: () => finder,
        findNext: () => {
          for (let i = row - 1; i < row - 1 + n && i < rows.length; i++) if (rows[i]?.[0] === id) return { getRow: () => i + 1 };
          return null;
        },
      };
      return finder;
    },
  });
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (r: string[]) => rows.push(r.slice()),
    setFrozenRows: () => {},
    getRange: (row: number, col: number, n = 1) => range(row, col, n),
  };
  const context = vm.createContext({
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet, insertSheet: () => sheet, getUrl: () => "sheet-url" }) },
    MailApp: {
      sendEmail: (m: { subject: string }) => {
        if (opts.mailFails) throw new Error("Service invoked too many times for one day: email.");
        mail.push(m);
      },
    },
    ContentService: { createTextOutput: (s: string) => ({ setMimeType: () => s }), MimeType: { JSON: "json" } },
    HtmlService: { createHtmlOutput: () => ({ setTitle: () => "html" }) },
    Utilities: { getUuid: () => "00000000-0000-4000-8000-000000000001" },
  });
  const dir = path.resolve(__dirname, "../../../apps-script");
  vm.runInContext(readFileSync(path.join(dir, "Sheet.js"), "utf8"), context);
  vm.runInContext(readFileSync(path.join(dir, "Code.gs"), "utf8"), context);
  const post = (data: object) => context.doPost({ postData: { contents: JSON.stringify(data) }, parameter: {} });
  const cols = vm.runInContext("COLUMNS", context) as string[];
  return { rows, mail, post, col: (r: string[], name: string) => r[cols.indexOf(name)] };
}

const lead = { leadId: "0b8a3f0e-5c1d-4c1e-9a77-2f3d1c9e8b10", stage: "contact", name: "Ali", email: "ali@example.com" };

test("a lead is saved and alerted once", () => {
  const h = harness();
  h.post(lead);
  h.post({ ...lead, stage: "product", product: "LT panels" });
  expect(h.rows).toHaveLength(2);
  expect(h.col(h.rows[1], "product")).toBe("LT panels");
  expect(h.mail).toHaveLength(1);
  expect(h.col(h.rows[1], "alerted")).toBe("contact");
});

test("a failed alert email still saves the lead and is retried later", () => {
  const h = harness({ mailFails: true });
  expect(() => h.post(lead)).not.toThrow();
  expect(h.rows).toHaveLength(2);
  expect(h.col(h.rows[1], "name")).toBe("Ali");
  expect(h.col(h.rows[1], "alerted")).toBe("");
});
