// GoodBiz Power Systems: saves quote-form leads to the "Power" sheet and emails
// an alert. Paste into Extensions → Apps Script of the Power spreadsheet as a
// file named "Code", next to "Sheet" (Sheet.js). Setup: docs/lead-sheet-setup.md

var ALERT_TO = "power@goodbizglobal.com";
var SHEET_NAME = "Leads";
var SITE_URL = "https://www.goodbizpower.com";

function doPost(e) {
  var request = parseRequest(e);
  var data = request.data;

  // The no-JavaScript form has no lead id and sends everything at once.
  if (request.form) {
    data.leadId = data.leadId || Utilities.getUuid();
    data.stage = "submitted";
    data.source = data.source || "quick";
  }

  // Bots that tick the hidden box, and posts with no id, get a polite answer and nothing else.
  var spam = data.website && String(data.website) !== "false";
  if (!data.leadId || spam) return reply_(request.form);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = leadsSheet_();
    var id = escapeCell(data.leadId);
    var found = sheet.getRange("A:A").createTextFinder(id).matchEntireCell(true).findNext();
    var rowIndex = found ? found.getRow() : sheet.getLastRow() + 1;
    var existing = found ? sheet.getRange(rowIndex, 1, 1, COLUMNS.length).getDisplayValues()[0] : null;

    var row = mergeRow(existing, data, new Date().toISOString());
    var alerts = alertsDue(row);
    alerts.forEach(function (stage) {
      sendAlert_(stage, row);
    });
    markAlerted(row, alerts);

    // Plain text format stops Sheets turning phone numbers and dates into something else.
    sheet.getRange(rowIndex, 1, 1, COLUMNS.length).setNumberFormat("@").setValues([row]);
  } finally {
    lock.releaseLock();
  }
  return reply_(request.form);
}

// Opening the /exec URL in a browser shows that the deployment is live.
function doGet() {
  return ContentService.createTextOutput("GoodBiz lead endpoint is running.");
}

function leadsSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

function sendAlert_(stage, row) {
  var get = function (name) {
    return String(row[COLUMNS.indexOf(name)] || "").replace(/^'/, "");
  };
  var subject =
    stage === "submitted"
      ? "Quote request: " + (get("productOther") || get("product") || "products") + " for " + (get("country") || "unknown country")
      : "New lead: " + get("name") + (get("company") ? ", " + get("company") : "");
  var body = COLUMNS.filter(function (name) {
    return name !== "alerted" && get(name);
  })
    .map(function (name) {
      return name + ": " + get(name);
    })
    .join("\n");
  var message = { to: ALERT_TO, subject: subject, body: body + "\n\nSheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl() };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) message.replyTo = get("email");
  MailApp.sendEmail(message);
}

function reply_(form) {
  if (!form) {
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<body style="font-family:system-ui,sans-serif;background:#e9f8ec;color:#0d2e25;padding:48px 20px;text-align:center">' +
      "<h1>Thanks, we've got your request</h1>" +
      "<p>We reply within one working day, by email or WhatsApp.</p>" +
      '<p><a href="' + SITE_URL + '" target="_top" style="color:#0f5a47">Back to GoodBiz Power Systems</a></p></body>'
  ).setTitle("Request received · GoodBiz Power Systems");
}
