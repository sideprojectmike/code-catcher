importScripts('extract.js');

// Polls Gmail's unread feed using your normal Gmail login (no tab, no API key), only while you've asked it to.
// shortcut: only watches the first signed-in Gmail account (u/0); add more feed URLs if you need others.
const FEED = 'https://mail.google.com/mail/u/0/feed/atom';
const WATCH_MS = 5 * 60 * 1000;
const EVERY_MS = 5000;
let looping = false;

async function fetchEntries() {
  try {
    const res = await fetch(FEED, { credentials: 'include', cache: 'no-store' });
    return res.ok ? parseFeed(await res.text()) : null;
  } catch { return null; }
}

// Icon click and Alt+Shift+C both land here: start watching, or stop if already on.
chrome.action.onClicked.addListener(async () => {
  const { until } = await chrome.storage.session.get('until');
  if (until > Date.now()) return stop();

  const entries = await fetchEntries();
  if (!entries) {
    return notify('Couldn\'t reach Gmail', 'Make sure you\'re signed into Gmail in Chrome, then try again.');
  }
  // Remember what's already there so an old code doesn't get copied.
  await chrome.storage.session.set({ until: Date.now() + WATCH_MS, seen: entries.map(e => e.id) });
  chrome.action.setBadgeBackgroundColor({ color: '#16a34a' });
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.action.setTitle({ title: 'Code Catcher: watching (click to stop)' });
  chrome.alarms.create('keepalive', { periodInMinutes: 0.5 });
  loop();
});

async function stop() {
  await chrome.storage.session.remove(['until', 'seen']);
  chrome.alarms.clear('keepalive');
  chrome.action.setBadgeText({ text: '' });
  chrome.action.setTitle({ title: 'Code Catcher: click to watch for a code' });
}

async function loop() {
  if (looping) return;
  looping = true;
  while (true) {
    const { until, seen } = await chrome.storage.session.get(['until', 'seen']);
    if (!(until > Date.now())) { await stop(); break; }

    const entries = await fetchEntries();
    const fresh = entries?.find(e => !seen.includes(e.id) && extractCode(e.text)); // newest first
    if (fresh) {
      await copy(extractCode(fresh.text));
      notify(`Code ${extractCode(fresh.text)} copied`, fresh.text.slice(0, 120));
      await stop();
      break;
    }
    await new Promise(r => setTimeout(r, EVERY_MS));
  }
  looping = false;
}

// If Chrome put the background worker to sleep mid-watch, this wakes it and resumes.
chrome.alarms.onAlarm.addListener(loop);

async function copy(code) {
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'Copy verification code to clipboard'
    });
  }
  await chrome.runtime.sendMessage({ type: 'copy', code });
}

function notify(title, message) {
  chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.png', title, message, priority: 2 });
}
