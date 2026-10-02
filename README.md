<h1 align="center">
    Northwestern Tokens
</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/@nu-appdev/northwestern-tokens"><img src="https://img.shields.io/npm/v/@nu-appdev/northwestern-tokens?style=flat&color=4E2A84" alt="npm Version"></a>
    <img src="https://img.shields.io/badge/Department_Templates-4.0-4E2A84?style=flat" alt="Department Templates 4.0">
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Version"></a>
</p>

<p align="center">
    <a href="https://www.northwestern.edu">Northwestern University</a> brand colors, fonts and radius as CSS custom properties and a <a href="https://tailwindcss.com">Tailwind CSS v4</a> theme.
</p>

## About

The package is CSS only: no components, no JavaScript and no framework-specific selectors. It tracks **Department Templates 4.0**, the university's current web template. dept 4.0 ships a compiled stylesheet and no design tokens, so this package reimplements its palette, fonts and square corners as tokens you can build on.

Colors come from the brand [color palette](https://www.northwestern.edu/brand/visual-identity/color-palettes/) and [secondary palette](https://www.northwestern.edu/brand/visual-identity/color-palettes/secondary-palette/) pages. Fonts load from the dept 4.0 CDN.

## Quick Start

```bash
pnpm add @nu-appdev/northwestern-tokens
```

### Tailwind CSS v4

Import the package after Tailwind, then import the theme:

```css
@import "tailwindcss";
@import "@nu-appdev/northwestern-tokens";
@import "@nu-appdev/northwestern-tokens/tailwind.css";
```

The first import adds the fonts and the `--nu-*` custom properties. The second maps them into Tailwind's theme, so you get utilities like these:

```html
<header class="bg-nu-purple-120 text-white">
    <h1 class="font-nu-display text-nu-purple-100">Department of Example</h1>
    <p class="font-nu-body text-nu-black-80">Body copy in Akkurat Pro.</p>
    <span class="border border-nu-success bg-nu-success/10">Saved</span>
</header>
```

Opacity modifiers like `/10` work on every color.

> [!NOTE]
> `tailwind.css` also sets Tailwind's radius scale (`rounded-xs` through `rounded-4xl`) to `--nu-border-radius`, which is `0`. Corners are square everywhere, including in third-party components that use `rounded-lg`. `rounded-full` and `rounded-none` are unaffected. To round corners again, override `--nu-border-radius`.

### Plain CSS

Import the default entry point, which contains the fonts and the custom properties:

```css
@import "@nu-appdev/northwestern-tokens";

body {
    font-family: var(--nu-font-body);
    color: var(--nu-black-80);
}

h1 {
    font-family: var(--nu-font-display);
    color: var(--nu-purple-100);
}
```

You can also load the parts separately:

| Entry point | Contents |
| --- | --- |
| `@nu-appdev/northwestern-tokens` | `fonts.css` and `tokens.css` |
| `@nu-appdev/northwestern-tokens/tokens.css` | The `--nu-*` custom properties on `:root` |
| `@nu-appdev/northwestern-tokens/fonts.css` | `@font-face` rules for Akkurat Pro, Poppins and Noto Serif |
| `@nu-appdev/northwestern-tokens/tailwind.css` | The Tailwind v4 `@theme` mapping. Needs `tokens.css`. |

The custom properties are not in a cascade layer. To put them in one, import them with `layer()`:

```css
@import "@nu-appdev/northwestern-tokens/tokens.css" layer(northwestern);
```

## Tokens

### Colors

| Custom property | Tailwind color | Value |
| --- | --- | --- |
| `--nu-purple-10` … `--nu-purple-160` | `nu-purple-10` … `nu-purple-160` | Purple 100 is Northwestern Purple, `#4e2a84` |
| `--nu-black-100`, `-80`, `-50`, `-20`, `-10` | `nu-black-100` … `nu-black-10` | Rich Black and its tints |
| `--nu-green`, `--nu-teal`, `--nu-blue`, `--nu-yellow`, `--nu-gold`, `--nu-orange` | `nu-green` … `nu-orange` | Secondary brights |
| `--nu-dark-green` … `--nu-dark-orange` | `nu-dark-green` … `nu-dark-orange` | Secondary darks |
| `--nu-color-success` | `nu-success` | `--nu-dark-green` |
| `--nu-color-info` | `nu-info` | `--nu-blue` |
| `--nu-color-warning` | `nu-warning` | `--nu-gold` |
| `--nu-color-danger` | `nu-danger` | `--nu-orange` |

The purple scale runs in steps of ten: 10 to 90 are tints, 110 to 160 are shades. Rich Black has only the five steps the brand page publishes values for.

The brand guidelines ask for white to dominate the page. Keep the secondary colors for differentiation, such as charts and status messages.

### Fonts

| Custom property | Tailwind font | Use |
| --- | --- | --- |
| `--nu-font-body` | `font-nu-body` | Akkurat Pro, for body and UI text |
| `--nu-font-heading` | `font-nu-heading` | Poppins, for headlines |
| `--nu-font-display` | `font-nu-display` | Noto Serif, for serif headings. It is the web substitute for Periódico. |

`fonts.css` registers the 16 faces that dept 4.0 does:

- **Akkurat Pro:** 300, 400 and 700, upright and italic
- **Poppins:** 100, 300, 400, 500, 700 and 800
- **Noto Serif:** 500 and 700, plus 400 and 700 italic

Every face uses `font-display: swap`.

### Radius

| Custom property | Tailwind | Value |
| --- | --- | --- |
| `--nu-border-radius` | `--radius-xs` … `--radius-4xl` | `0` |

## Akkurat Pro must load from Northwestern

Akkurat Pro's license allows only central hosting by the university. **Do not download, bundle or self-host the font files.** `fonts.css` loads every face, Akkurat included, from `https://common.northwestern.edu/dept/4.0/css/fonts/`, and the package contains no font files.

If your build tool rewrites or copies `url()` assets, make sure it leaves absolute `https://` URLs alone. Vite and Tailwind do by default.

## Purple 90

The brand page publishes Purple 90 as RGB **91, 59, 14**. That is a dark brown (`#5b3b0e`), not a purple. This package uses **`#5b3b8c`** (RGB 91, 59, 140) instead, for three reasons:

- The page's own CMYK values for Purple 90 (79, 86, 0, 11 coated) have no yellow, which a blue channel of 14 would need.
- Halfway between Purple 100 (78, 42, 132) and Purple 80 (104, 76, 150) is 91, 59, 141. The red and green channels match the published values, and 140 is the blue channel that fits.
- `northwestern-filament-theme` and `northwestern-starlight-theme` both already use `#5b3b8c`.

If the brand page publishes a corrected value, it will replace this one.

## Relationship to the Northwestern themes

The tokens package is the single source for the palette and fonts that the Northwestern themes used to maintain by hand.

- **[`northwestern-filament-theme`](https://github.com/NIT-Administrative-Systems/northwestern-filament-theme)** 4.0 imports the tokens at build time and re-exports them, including the Tailwind mapping. Laravel apps get NU styling through the theme and don't install this package themselves.
- **[`northwestern-starlight-theme`](https://github.com/NIT-Administrative-Systems/northwestern-starlight-theme)** 1.8 imports the custom properties and fonts from npm. Starlight doesn't use Tailwind.

The themes keep their own interface tokens, such as surfaces, focus rings, link colors and dark mode. This package defines only what dept 4.0 and the brand pages specify.

## Development

```bash
pnpm install
pnpm verify    # Biome, Stylelint, dependency check and tests
pnpm fix       # Auto-fix formatting and lint issues
pnpm test      # Vitest suite
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

The MIT License (MIT). Please see [LICENSE](LICENSE) for more information. The license covers this package's CSS, not the fonts it loads.
