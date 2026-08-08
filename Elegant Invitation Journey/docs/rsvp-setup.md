# Connecting RSVPs to the Google Sheet

Every RSVP appends a row to the spreadsheet and emails the couple. The site
posts to its own server, which forwards to an Apps Script web app — the browser
never sees the webhook URL, and there is no CORS to fight.

Sheet: https://docs.google.com/spreadsheets/d/1x6GxGEo09AoOs-0KNa9CXCXCxEgz3a83NRJQv551pRo/edit

## 1. Add the script

1. Open the sheet.
2. **Extensions → Apps Script**. A new tab opens on a file called `Code.gs`.
3. Delete everything in it and paste the whole of `docs/rsvp-apps-script.gs`.
4. Click the **save** icon.

## 2. Grant permissions

1. In the function dropdown at the top, choose **setup**, then click **Run**.
2. Google will warn that the script needs permission. Click
   **Review permissions → your account → Advanced → Go to (project name)
   → Allow**. The warning is expected: it is your own unpublished script.
3. Check the inbox for a mail titled "RSVP inbox is connected", and the sheet
   for its header row. If both arrived, the Google side works.

## 3. Deploy it as a web app

1. **Deploy → New deployment**.
2. Click the gear next to "Select type" and pick **Web app**.
3. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. **Deploy**, then copy the **Web app URL**. It ends in `/exec`.

"Anyone" sounds alarming but is required — the wedding site's server calls this
without a Google login. The URL is unguessable and lives only in an environment
variable, never in the page.

## 4. Give the site the URL

On Vercel: **Project → Settings → Environment Variables**.

| Name | Value |
| --- | --- |
| `RSVP_WEBHOOK_URL` | the `/exec` URL from step 3 |

Apply it to Production, Preview and Development, then **redeploy** — environment
variables are read at build time, so an existing deployment will not pick it up.

For local testing, put the same line in a `.env` file at the project root:

```
RSVP_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
```

## 5. Check it end to end

Submit a real RSVP on the live site. Within a few seconds you should see a new
row in the sheet and an email. If the site instead says it could not save your
RSVP, the variable is missing or the deployment is not public — check
**Apps Script → Executions** for the reason.

## Changing the script later

Edits are not live until redeployed. Use **Deploy → Manage deployments →
pencil icon → Version: New version → Deploy**. That keeps the same `/exec` URL,
so nothing needs changing on Vercel.
