# Code Catcher

A Chrome extension that grabs verification codes from your Gmail and copies them to your clipboard, so you don't have to open the email.

## Install

1. Unzip `code-catcher.zip`.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose the `code-catcher` folder.
4. Allow access to mail.google.com when Chrome asks.
5. Pin it: click the puzzle-piece icon in the toolbar, then the pin next to Code Catcher.

You need to be signed into Gmail in Chrome. No Gmail tab has to be open.

## Use

1. When you're about to get a code (say, right before clicking "Send code" on a site), click the Code Catcher icon or press **Alt+Shift+C** (**Option+Shift+C** on a Mac).
2. A green **ON** badge appears. It checks your inbox every 5 seconds for up to 5 minutes.
3. When the code email arrives, the code is copied and you get a notification like "Code 482913 copied". Just paste it.

It turns itself off after catching a code or after 5 minutes. Click the icon (or press the shortcut) again to stop it early.

Codes already in your inbox when you start are ignored, so it only grabs the new one.

## Updating

Replace the folder with the new version, then click the reload icon on Code Catcher in `chrome://extensions`.

## Troubleshooting

- **Shortcut does nothing:** another extension may already use it. Change it at `chrome://extensions/shortcuts`.
- **"Couldn't reach Gmail" notification:** sign into Gmail in Chrome and try again.
- **Code not caught:** it only looks at the subject and the first line or so of the email. If the code is buried further down, it'll miss it.

## Limits

- Only watches your first signed-in Gmail account.
- Doesn't read texted (SMS) codes.
- Uses Gmail's old unread-mail feed, which other notifier extensions also rely on. If Google ever turns it off, this stops working.

## Files

| File | What it does |
|------|--------------|
| `manifest.json` | Extension settings, permissions, and the shortcut |
| `background.js` | Starts/stops watching, checks Gmail, copies, notifies |
| `extract.js` | Finds the code in an email and reads Gmail's feed |
| `offscreen.html`, `offscreen.js` | Hidden page that does the actual clipboard copy |
| `test.js` | Tests for code detection (`node test.js`), not needed to run the extension |
