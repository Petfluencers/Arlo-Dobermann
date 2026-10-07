# Arlo Dobermann

Jekyll site served by GitHub Pages. Build locally with `bundle install` and
`bundle exec jekyll build` (dependencies are declared in `Gemfile`).

## Accessible Instagram reels

`doberman-diaries.html` renders twelve saved reels from `_data/reels.json`, so
captions, dates and ordinary Instagram links are available before JavaScript runs.
`js/reels.js` refreshes them once per page visit from the public SociableKIT feed:
`https://data.accentapi.com/feed/25659808.json`. This is the JSON Data link exposed
by Arlo's existing widget, not a private credential. No subscription or account
change is needed. Feed requests explicitly omit credentials.

The provider controls update timing and ordering, including pinned posts. A
successful response is validated and saved in this browser's local storage. On
network, timeout, HTTP, JSON or empty-feed failure, the last successful browser
snapshot remains; first-time visitors get the committed snapshot. If storage is
blocked, the live feed and committed fallback still work. Refreshes never replace
a focused reel link. Only Instagram destinations and SociableKIT's image cache
are accepted. Captions are inserted as text, not HTML.

The committed snapshot was retrieved on October 7, 2026. Refresh it periodically
from the public feed when maintaining the site: retain `code`, `link`,
`pic_text_raw`, `image_url`, and `date_time_posted` as `id`, `url`, `caption`,
`image`, and `date`; keep the first twelve valid posts. `date_label` is the written
date corresponding to the first ten characters of `date`; update `saved_at` and
`saved_label` together. This fallback refresh is independent of automatic live
updates. Remote thumbnails may expire; the captions and links remain useful.

The grid intentionally links to Instagram for playback. Post captions are not
video transcripts. This change does not supply closed captions, audio
descriptions, or guarantee Instagram's player accessibility. It removes the
third-party modal and its keyboard/focus problems from this site.

## Tests

Core tests need only Node:

```sh
node --test tests/reels.test.cjs
node --check js/reels.js
git diff --check
```

DOM tests use jsdom, kept outside the site's runtime dependencies:

```sh
npm install --prefix /tmp/arlo-a11y-tests jsdom
NODE_PATH=/tmp/arlo-a11y-tests/node_modules node --test tests/*.test.cjs
```

These cover validation, unsafe destinations, duplicate/empty posts, failed
requests, timeout, blocked storage, last-good caching, safe text rendering,
failed thumbnails, and focus preservation. Tests and this README are excluded
from Jekyll output. Manual review should include keyboard navigation, mobile
reflow, the browser accessibility tree, and playback accessibility on Instagram.
