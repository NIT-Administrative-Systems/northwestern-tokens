# Contributing

Development setup, conventions, and PR process for Northwestern Tokens.

## Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | 22+     |
| pnpm    | 10+     |

## Setup

Clone the repo and install dependencies:

```bash
git clone git@github.com:NIT-Administrative-Systems/northwestern-tokens.git
cd northwestern-tokens
pnpm install
```

## Project structure

```
css/
  index.css       # Default entry point: imports fonts.css and tokens.css
  tokens.css      # --nu-* custom properties on :root
  fonts.css       # @font-face rules pointing at the dept 4.0 CDN
  tailwind.css    # Tailwind v4 @theme mapping to the --nu-* properties
tests/
  tokens.test.ts  # Vitest suite that parses the CSS
```

The package publishes the files in `css/` as they are. There is no build step.

## Making changes

### Where values come from

Every value has to trace back to a published source. Don't add a color, weight or font because it looks right.

- **Colors:** the brand [color palette](https://www.northwestern.edu/brand/visual-identity/color-palettes/) and [secondary palette](https://www.northwestern.edu/brand/visual-identity/color-palettes/secondary-palette/) pages. Where a tint is published only as RGB, convert it to hex.
- **Fonts:** the `@font-face` rules in the [Department Templates 4.0 stylesheet](https://common.northwestern.edu/dept/4.0/css/styles.css). Register only the files that stylesheet references. Check every new URL with `curl -sI` before adding it.
- **Radius:** dept 4.0 uses square corners.

> [!WARNING]
> Never commit font files. Akkurat Pro's license allows only central hosting by the university, and the test suite fails if a font file appears in `css/`.

### Adding a token

1. Add the custom property to `css/tokens.css`, using the `--nu-*` prefix.
2. Map it in `css/tailwind.css`, as a `var()` reference to the new property.
3. If it's a color, add its published value to the fixture in `tests/tokens.test.ts`.
4. Add it to the token tables in `README.md`.

Renaming or removing a token is a breaking change for both Northwestern themes. Treat it as a major release.

### Commands

```bash
pnpm verify    # Biome, Stylelint, knip and the Vitest suite
pnpm fix       # Auto-fix formatting and lint issues
pnpm test      # Vitest suite
```

### Testing

The [Vitest](https://vitest.dev/) suite parses the CSS with PostCSS and checks that:

- every custom property in `tokens.css` has a Tailwind mapping in `tailwind.css`, and every mapping points at a real property
- every color matches the published palette, and the semantic colors match what `northwestern-filament-theme` defines
- every `@font-face` loads a `.woff2` from `common.northwestern.edu/dept/4.0/css/fonts/` with `font-display: swap`, and no font files are bundled

CI also packs the package and compiles it with the Tailwind v4 CLI, against Tailwind 4.0 and the latest 4.x.

## Code style

### Formatting

[Biome](https://biomejs.dev/) handles TypeScript, JSON and CSS formatting. [Stylelint](https://stylelint.io/) lints CSS with [recess property ordering](https://github.com/stormwarning/stylelint-config-recess-order).

- 4-space indentation, 120-character line width
- Double quotes, always semicolons, trailing commas
- Lowercase hex colors, short form where possible

### CSS

- No selectors besides `:root`, `@font-face` and `@theme`. Theme-specific styling belongs in the themes.
- No `@layer` in the package. Consumers choose a layer with `@import … layer()`.

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add the Rich Black 40 tint
fix: correct the Rich Black 50 hex value
docs: explain the Purple 90 correction
```

Keep the subject line under 70 characters. A body is optional; use one if the "why" isn't obvious from the subject.

## Pull requests

1. Fork the repo and create a branch from `main`
2. Make your changes and run `pnpm verify`
3. Push your branch and open a PR against `main`

CI runs the unit tests, Biome, Stylelint, the dependency check and the Tailwind smoke build. All checks must pass.

> [!NOTE]
> Open a draft PR if you want early feedback on an approach before finishing the implementation.

### Color changes

Link the brand page entry the new value comes from.

### New tokens

Open an issue first. The package follows Department Templates 4.0 and the brand guidelines, so not all additions will be accepted.

## Releases

Maintainers trigger releases through the GitHub Actions release workflow, with a version in the form `v#.#.#`. It runs `pnpm verify`, bumps `package.json`, tags the release, creates a GitHub release and publishes to npm with provenance.

The changelog follows [Keep a Changelog](https://keepachangelog.com/) format. Update `CHANGELOG.md` as part of your PR if your changes are user-facing.

## Questions?

Open an issue on [GitHub](https://github.com/NIT-Administrative-Systems/northwestern-tokens/issues).
