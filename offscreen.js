chrome.runtime.onMessage.addListener(msg => {
  if (msg.type !== 'copy') return;
  const t = document.getElementById('t');
  t.value = msg.code;
  t.select();
  document.execCommand('copy'); // navigator.clipboard needs focus, which offscreen pages never have
});
