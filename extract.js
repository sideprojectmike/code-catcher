// Pulls a verification code out of an email subject + preview, or returns null.
function extractCode(text) {
  if (!/\b(code|verif|otp|passcode|pin|one[- ]time|security|confirm|login|sign[- ]in|2fa)/i.test(text)) return null;
  const hits = [...text.matchAll(/(?<![\d$.,:/])(\d{3}[- ]\d{3}|\d{4,8})(?![\d.,:/%])/g)]
    .map(m => m[1].replace(/[- ]/g, ''))
    .filter(c => !/^(19|20)\d\d$/.test(c)); // skip years like 2026
  return hits.find(c => c.length === 6) || hits[0] || null;
}

// Gmail's unread-inbox Atom feed -> [{id, text}]. Regex because service workers have no DOMParser.
function parseFeed(xml) {
  const tag = (s, name) => (s.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)) || [, ''])[1];
  const decode = s => s.replace(/&(amp|lt|gt|quot|#39|apos);/g,
    (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[e]);
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: tag(e, 'id'),
    text: decode(`${tag(e, 'title')} ${tag(e, 'summary')}`)
  }));
}

if (typeof module !== 'undefined') module.exports = { extractCode, parseFeed };
