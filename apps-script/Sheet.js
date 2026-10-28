// GoodBiz Power Systems lead sheet: pure helpers used by Code.gs.
// Paste this file into the Apps Script project as a script file named "Sheet".
// It has no imports so Apps Script can run it as-is; the last line lets the
// website's tests load it in Node.

var COLUMNS = [
  "leadId", "firstSeen", "updated", "stage", "source",
  "name", "company", "email", "phone",
  "product", "productOther", "variety", "quantity", "quantityOther",
  "country", "port", "terms", "notes", "details",
  "page", "prefilled", "lang", "userAgent", "alerted",
];

var STAGES = ["contact", "product", "variety", "quantity", "destination", "terms", "submitted"];

// Columns the visitor's browser may never write.
var PROTECTED = ["firstSeen", "updated", "alerted"];

var MAX_CELL = 2000;

// Sheets runs a cell starting with = + - @ (or a tab / carriage return before
// one) as a formula, so those get a leading apostrophe.
function escapeCell(value) {
  if (value === undefined || value === null) return "";
  // Only spaces are trimmed: a leading tab or carriage return must survive to be escaped.
  var s = String(value).replace(/^ +| +$/g, "").slice(0, MAX_CELL);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// Ids come from crypto.randomUUID (or the site's fallback) and Utilities.getUuid:
// letters, digits and hyphens. Anything else, such as "leadId", is refused so a
// post can never match the header row.
function isLeadId(id) {
  return typeof id === "string" && /^(?=.*\d)(?=.*-)[A-Za-z0-9-]{8,64}$/.test(id);
}

function stageRank(stage) {
  return STAGES.indexOf(stage);
}

// One row per leadId: filled cells are never emptied, firstSeen is kept and the
// stage only moves forward, so a late in-between send cannot undo "submitted".
function mergeRow(existing, incoming, now) {
  // Cells read back with getDisplayValues have lost their apostrophe, so escape them again.
  var row = existing ? existing.map(escapeCell) : COLUMNS.map(function () { return ""; });
  while (row.length < COLUMNS.length) row.push("");
  COLUMNS.forEach(function (name, i) {
    if (PROTECTED.indexOf(name) !== -1 || name === "stage") return;
    var value = escapeCell(incoming[name]);
    if (value !== "") row[i] = value;
  });
  var s = COLUMNS.indexOf("stage");
  var next = String(incoming.stage || "");
  if (stageRank(next) > stageRank(row[s])) row[s] = next;
  if (!row[COLUMNS.indexOf("firstSeen")]) row[COLUMNS.indexOf("firstSeen")] = now;
  row[COLUMNS.indexOf("updated")] = now;
  return row;
}

// "contact" when a lead first arrives, "submitted" when the request is finished.
// A lead that arrives already finished gets one email, for the full request.
function alertsDue(row) {
  var stage = row[COLUMNS.indexOf("stage")];
  var sent = String(row[COLUMNS.indexOf("alerted")] || "").split(",");
  if (stage === "submitted") return sent.indexOf("submitted") === -1 ? ["submitted"] : [];
  if (stageRank(stage) >= 0 && sent.indexOf("contact") === -1) return ["contact"];
  return [];
}

function markAlerted(row, alerts) {
  var i = COLUMNS.indexOf("alerted");
  var sent = String(row[i] || "").split(",").filter(Boolean);
  alerts.forEach(function (a) {
    if (sent.indexOf(a) === -1) sent.push(a);
    if (a === "submitted" && sent.indexOf("contact") === -1) sent.push("contact");
  });
  row[i] = sent.join(",");
  return row;
}

// The website sends JSON as text/plain; the no-JavaScript form posts form-encoded.
function parseRequest(e) {
  var contents = e && e.postData ? e.postData.contents : "";
  try {
    var data = JSON.parse(contents);
    if (data && typeof data === "object" && !Array.isArray(data)) return { data: data, form: false };
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // not JSON: fall through to the form fields
  }
  return { data: (e && e.parameter) || {}, form: true };
}

if (typeof module !== "undefined") {
  module.exports = { COLUMNS: COLUMNS, STAGES: STAGES, escapeCell: escapeCell, isLeadId: isLeadId, mergeRow: mergeRow, alertsDue: alertsDue, markAlerted: markAlerted, parseRequest: parseRequest };
}
