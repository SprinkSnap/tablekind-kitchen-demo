# Case-study screenshots

Publish-ready frames for `https://chexustudio.com/work/`.

## Best single showcase shot (use first)

| Device | File |
| --- | --- |
| Desktop | [`showcase/showcase-desktop-homepage-hero.png`](./showcase/showcase-desktop-homepage-hero.png) |
| Tablet | [`showcase/showcase-tablet-homepage-hero.png`](./showcase/showcase-tablet-homepage-hero.png) |
| Mobile | [`showcase/showcase-mobile-homepage-sticky-actions.png`](./showcase/showcase-mobile-homepage-sticky-actions.png) |

## Folders

- [`desktop/`](./desktop/) — 8 shots (1440×900 @ 2×)
- [`tablet/`](./tablet/) — 5 shots (iPad Pro 11 @ 2×)
- [`mobile/`](./mobile/) — 7 shots (iPhone 14 @ 2×)
- [`showcase/`](./showcase/) — the three primary frames above

## Regenerate

```bash
npm run dev
# in another terminal:
npm run screenshots -- http://127.0.0.1:4321 ./docs/screenshots
```

Or per device:

```bash
npm run screenshots:desktop -- http://127.0.0.1:4321 ./docs/screenshots/desktop
npm run screenshots:tablet -- http://127.0.0.1:4321 ./docs/screenshots/tablet
npm run screenshots:mobile -- http://127.0.0.1:4321 ./docs/screenshots/mobile
```

See `CASE_STUDY_COPY.md` for captions and publish guidance. Do not invent traffic or conversion metrics.
