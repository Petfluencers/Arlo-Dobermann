// Run with jsdom available through NODE_PATH (see README).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { init } = require('../js/reels.js');
const fixture = {posts: [{code: 'test123', link: 'https://www.instagram.com/reel/test123/', date_time_posted: '2026-10-07T10:00:00Z', pic_text_raw: '<img src=x onerror=alert(1)> caption', image_url: 'https://data-image.sociablekit.com/sources/instagram-reels/arlo.dobermann/test123.webp'}]};
function page() {
  return new JSDOM('<section data-reels><p data-reels-status></p><ul data-reels-list><li><a href="https://www.instagram.com/arlo.dobermann/">Saved reel</a></li></ul></section>', {url: 'https://www.arlodobermann.com/doberman-diaries'}).window;
}
test('renders safe text and usable links; failed image leaves the caption', async () => {
  const win = page();
  win.fetch = async () => ({ok: true, json: async () => fixture});
  await init(win.document, win);
  assert.equal(win.document.querySelectorAll('img').length, 1);
  assert.equal(win.document.querySelector('a').href, fixture.posts[0].link);
  assert.match(win.document.querySelector('.reel-caption').textContent, /<img/);
  win.document.querySelector('img').dispatchEvent(new win.Event('error'));
  assert.equal(win.document.querySelectorAll('img').length, 0);
  assert.ok(win.document.querySelector('a'));
  win.close();
});
test('HTTP, offline, malformed, empty, and aborted updates preserve server-rendered posts', async () => {
  for (const fetcher of [async () => ({ok: false}), async () => {throw Error('offline')}, async () => ({ok: true, json: async () => ({})}), async () => ({ok: true, json: async () => ({posts: []})}), async (_, {signal}) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Error('timeout'))))]) {
    const win = page();
    const original = win.document.querySelector('a');
    win.fetch = fetcher;
    // Exercise the actual timeout branch without waiting eight seconds.
    win.setTimeout = callback => setTimeout(callback, 1);
    await init(win.document, win);
    assert.equal(win.document.querySelector('a'), original);
    assert.match(win.document.querySelector('[data-reels-status]').textContent, /temporarily unavailable/);
    win.close();
  }
});
test('updates never remove the focused link; successful data is cached for next visit', async () => {
  const win = page();
  const original = win.document.querySelector('a');
  original.focus();
  win.fetch = async () => ({ok: true, json: async () => fixture});
  await init(win.document, win);
  assert.equal(win.document.activeElement, original);
  // A delayed script must not replace already-focused server HTML with cache either.
  await init(win.document, win);
  assert.equal(win.document.activeElement, original);
  assert.match(win.localStorage.getItem('arlo-reels-v1'), /test123/);
  assert.match(win.document.querySelector('[data-reels-status]').textContent, /Reload/);
  win.close();
});
test('cached posts remain on failure and denied storage does not stop a live update', async () => {
  const win = page();
  win.fetch = async () => ({ok: true, json: async () => fixture});
  await init(win.document, win);
  win.fetch = async () => {throw Error('offline')};
  await init(win.document, win);
  assert.equal(win.document.querySelector('a').href, fixture.posts[0].link);
  Object.defineProperty(win, 'localStorage', {get() {throw Error('blocked')}});
  win.fetch = async () => ({ok: true, json: async () => fixture});
  await init(win.document, win);
  assert.equal(win.document.querySelector('a').href, fixture.posts[0].link);
  win.close();
});
