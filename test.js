// Run with: node test.js
const assert = require('assert');
const { extractCode, parseFeed } = require('./extract.js');

assert.equal(extractCode('Your verification code is 482913'), '482913');
assert.equal(extractCode('Google: G-123456 is your code'), '123456');
assert.equal(extractCode('Your Instagram code: 123 456'), '123456');
assert.equal(extractCode('Use 4821 to sign in. Expires in 10 minutes.'), '4821');
assert.equal(extractCode('Security alert 2026 - code 77120'), '77120');
assert.equal(extractCode('Your order #55821 has shipped'), null);
assert.equal(extractCode('Dinner Friday at 7?'), null);

const feed = `<feed><title>Gmail - Inbox</title>
<entry><title>Your login code</title><summary>Hi Mike, use 553 019 &amp; don&#39;t share it</summary>
<id>tag:gmail.google.com,2004:111</id></entry>
<entry><title>Lunch?</title><summary>you free at 12</summary><id>tag:gmail.google.com,2004:222</id></entry></feed>`;
const entries = parseFeed(feed);
assert.equal(entries.length, 2);
assert.equal(entries[0].id, 'tag:gmail.google.com,2004:111');
assert.equal(entries[0].text, "Your login code Hi Mike, use 553 019 & don't share it");
assert.equal(extractCode(entries[0].text), '553019');
assert.equal(extractCode(entries[1].text), null);
console.log('all passed');
