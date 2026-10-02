# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-02

### Added

- **Brand palette as CSS custom properties.** `tokens.css` defines Northwestern Purple 10 through 160, Rich Black and its four published tints, the six secondary brights and six secondary darks, and four semantic colors on `:root`. The names are the `--nu-*` names `northwestern-filament-theme` and `northwestern-starlight-theme` already use, so neither theme has to rename a token to adopt the package.
- **Tailwind CSS v4 theme.** `tailwind.css` maps every custom property into an `@theme` block: `--color-nu-*` colors, `--font-nu-body`, `--font-nu-heading` and `--font-nu-display`, and Tailwind's radius scale. The color names match the filament theme's `dist/tailwind-tokens.css`.
- **Department Templates 4.0 fonts.** `fonts.css` registers the 16 Akkurat Pro, Poppins and Noto Serif faces that dept 4.0 serves, as `.woff2` from `common.northwestern.edu/dept/4.0/css/fonts/`, with `font-display: swap`. Akkurat Pro's license allows only central hosting by the university, so the package contains no font files.
- **Square corners.** `--nu-border-radius` is `0`, and `tailwind.css` points `--radius-xs` through `--radius-4xl` at it.
- **Purple 90 is `#5b3b8c`.** The brand page publishes Purple 90 as RGB 91, 59, 14, which is brown. The blue channel is read as 140: the page's CMYK values for Purple 90 have no yellow, 140 sits between Purple 100 and Purple 80, and both themes already use `#5b3b8c`. See the [README](README.md#purple-90).

[Unreleased]: https://github.com/NIT-Administrative-Systems/northwestern-tokens/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/NIT-Administrative-Systems/northwestern-tokens/releases/tag/v1.0.0
