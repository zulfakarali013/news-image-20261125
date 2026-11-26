# Wednesday 25 November 2026, in one image

[![news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/zulfakarali013/news-image-20261125/rank.svg)](https://make.fun/bounty/news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/zulfakarali013/news-image-20261125/reward.svg)](https://make.fun/bounty/news-image-20261125)

An entry for the make.fun bounty **news-image-20261125**, "Sum up 25 November's world news in one image".

One 1024×1024 front page covering 53 stories from 11 regions and 23 fields. Every story happened, or was first reported, on Wednesday 25 November 2026. Edition 2 uses bigger type throughout, so headlines and the list still read when the page is shrunk to about 300 px; Edition 3 keeps that type and fits all 53 stories back in with tighter card wording and spacing.

- **3 lead stories** with drawings, a status chip and a "why it matters" line:
  - the US tariff proposal on 14 economies
  - the AI chip rout that sank Seoul's Kospi 6.2%
  - Pakistan's first astronaut docking at China's Tiangong station
- **10 picture panels**:
  - Cairo tanker fire
  - Hormuz mines claim
  - Houthi refinery claim
  - UK energy cap +26%
  - Macy's parade moved
  - Iowa Army blast
  - Cartagena hostages freed
  - Solomon Islands–Australia treaty
  - Savasleyka jets claim
  - Champions League night
- **40 more stories** in a numbered list, coloured by region.
- **Header**:
  - region bar and field counts
  - a numbers bar
- **Lower panel**:
  - a "where it happened" map
  - a UTC timeline of the day
- **Checks and sources**:
  - a DATE CHECK box naming the earlier (24 Nov) news that was left out
  - a status key (official / confirmed / reported / claim)
  - named sources

## Run

```
node main.ts            # writes /output/entry.png
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` uses only the Node standard library and makes no network calls. It decodes `entry.png.b64` and checks the size limits (≤1 MiB, ≤1024 px). It writes the same bytes on every run.

## Redraw

`render/` holds the story data (`stories.json`), the original SVG drawings (`art.mjs`), the map (`map.mjs`) and the page layout (`build.mjs`). To rebuild:

```
npm install && npm run render
```

The redraw needs Playwright, as a dev dependency only.

## License

MIT
