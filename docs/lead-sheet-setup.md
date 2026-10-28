# Lead sheet setup (Power sheet)

The website's quote forms send every lead to a Google Sheet through a small
Apps Script web app, and the script emails **power@goodbizglobal.com** when a
lead arrives and again when the request is finished. Until the web app URL is
set, the forms still work: visitors get "Send on WhatsApp" and "Send by email"
buttons instead.

Do every step while signed in to the **goodbizglobal.com** Google Workspace
account that should own the sheet. Alerts are sent from that account.

## 1. Create the sheet

1. Go to [sheets.new](https://sheets.new) and name the file **Power**.
2. Leave it empty. The script creates a **Leads** tab with the header row the
   first time a lead arrives.

## 2. Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Rename the project to **GoodBiz leads**.
3. Replace everything in `Code.gs` with the contents of
   [`apps-script/Code.gs`](../apps-script/Code.gs).
4. Click **+ → Script**, name it **Sheet**, and paste the contents of
   [`apps-script/Sheet.js`](../apps-script/Sheet.js).
5. Click **Save**.

## 3. Deploy it as a web app

1. Click **Deploy → New deployment**, then the gear icon → **Web app**.
2. Description: `Quote form`.
3. **Execute as: Me** (your goodbizglobal.com address).
4. **Who has access: Anyone**.
   - If "Anyone" is not in the list, your Workspace blocks public web apps.
     In the [Admin console](https://admin.google.com) go to
     **Apps → Google Workspace → Drive and Docs → Sharing settings** and allow
     sharing outside goodbizglobal.com, wait a few minutes, then try again.
5. Click **Deploy**, then **Authorize access**. Pick your account. On "Google
   hasn't verified this app", click **Advanced → Go to GoodBiz leads** and
   **Allow**. (It's your own script, so this warning is expected.)
6. Copy the **Web app URL**. It ends in `/exec`.

Open that URL in a browser: it should say "GoodBiz lead endpoint is running."

## 4. Send a test lead

In a terminal (replace the URL):

```bash
curl -L -H "Content-Type: text/plain;charset=utf-8" -d '{"leadId":"test-1","stage":"contact","name":"Test","email":"test@example.com"}' "https://script.google.com/macros/s/XXXX/exec"
```

You should see `{"ok":true}`. A **Leads** tab appears with one row, and
power@goodbizglobal.com receives a "New lead: Test" email. Delete the test row
afterwards.

## 5. Connect the website

1. In Vercel, open the project → **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_LEAD_ENDPOINT` = the `/exec` URL, for Production and Preview.
3. **Redeploy** (the value is built into the pages, so a redeploy is required).
4. Fill in the form at `/quote` on the live site and check the sheet and inbox.

## Changing the script later

Edit the code, then **Deploy → Manage deployments → (pencil) Edit →
Version: New version → Deploy**. The URL stays the same, so the website needs
no change. ("New deployment" would create a new URL.)

## What the sheet holds

One row per visitor, keyed by `leadId`. Each step of the form updates that row;
filled cells are never emptied, `firstSeen` keeps the first visit, `updated`
moves on, and `stage` only moves forward (`contact` → … → `submitted`). The
`alerted` column records which emails were sent. Rows posted without
JavaScript arrive complete, with `stage` = `submitted`, and show choice ids
such as `lt-panels` or `cif` rather than labels.

Gmail-based Workspace accounts can send about 1,500 alert emails a day from
Apps Script, far more than this form needs.
