import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import postcss, { type AtRule, type Declaration, type Root } from "postcss";
import { describe, expect, it } from "vitest";

const cssDir = join(import.meta.dirname, "..", "css");

function parse(file: string): Root {
    return postcss.parse(readFileSync(join(cssDir, file), "utf8"), { from: file });
}

function declarations(node: Root | AtRule): Declaration[] {
    const found: Declaration[] = [];
    node.walkDecls((decl) => {
        found.push(decl);
    });
    return found;
}

function varReferences(value: string): string[] {
    return [...value.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((match) => match[1]);
}

const tokens = new Map(
    declarations(parse("tokens.css"))
        .filter((decl) => decl.prop.startsWith("--nu-"))
        .map((decl) => [decl.prop, decl.value]),
);

function resolve(value: string): string {
    const [reference] = varReferences(value);
    return reference ? resolve(tokens.get(reference) ?? "") : value;
}

function normalizeHex(hex: string): string {
    const digits = hex.toLowerCase().replace("#", "");
    return `#${digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits}`;
}

function rgbToHex([r, g, b]: [number, number, number]): string {
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The values published on the brand palette pages, as printed there. Some purple tints
 * are published only as RGB; where a hex value is published too, both are recorded.
 *
 * https://www.northwestern.edu/brand/visual-identity/color-palettes/
 * https://www.northwestern.edu/brand/visual-identity/color-palettes/secondary-palette/
 */
const published: Record<string, { rgb?: [number, number, number]; hex?: string }> = {
    "--nu-purple-10": { rgb: [228, 224, 238], hex: "#E4E0EE" },
    "--nu-purple-20": { rgb: [204, 196, 223] },
    "--nu-purple-30": { rgb: [182, 172, 209], hex: "#B6ACD1" },
    "--nu-purple-40": { rgb: [164, 149, 195] },
    "--nu-purple-50": { rgb: [147, 128, 182] },
    "--nu-purple-60": { rgb: [131, 110, 170], hex: "#836EAA" },
    "--nu-purple-70": { rgb: [118, 93, 160] },
    "--nu-purple-80": { rgb: [104, 76, 150] },
    // Published as 91, 59, 14. The blue channel is read as 140; see the README.
    "--nu-purple-90": { rgb: [91, 59, 140] },
    "--nu-purple-100": { rgb: [78, 42, 132], hex: "#4E2A84" },
    "--nu-purple-110": { rgb: [72, 36, 118] },
    "--nu-purple-120": { rgb: [64, 31, 104], hex: "#401F68" },
    "--nu-purple-130": { rgb: [56, 23, 90] },
    "--nu-purple-140": { rgb: [48, 16, 78] },
    "--nu-purple-150": { rgb: [38, 8, 65] },
    "--nu-purple-160": { rgb: [29, 2, 53] },

    "--nu-black-100": { rgb: [0, 0, 0] },
    "--nu-black-80": { hex: "#342F2E" },
    "--nu-black-50": { hex: "#716C6B" },
    "--nu-black-20": { hex: "#BBB8B8" },
    "--nu-black-10": { hex: "#D8D6D6" },

    "--nu-green": { rgb: [88, 185, 71], hex: "#58B947" },
    "--nu-teal": { rgb: [127, 206, 205], hex: "#7FCECD" },
    "--nu-blue": { rgb: [80, 145, 205], hex: "#5091CD" },
    "--nu-yellow": { rgb: [237, 233, 59], hex: "#EDE93B" },
    "--nu-gold": { rgb: [255, 197, 32], hex: "#FFC520" },
    "--nu-orange": { rgb: [239, 85, 63], hex: "#EF553F" },

    "--nu-dark-green": { rgb: [0, 134, 86], hex: "#008656" },
    "--nu-dark-teal": { rgb: [0, 127, 164], hex: "#007FA4" },
    "--nu-dark-blue": { rgb: [13, 45, 108], hex: "#0D2D6C" },
    "--nu-dark-yellow": { rgb: [217, 200, 38], hex: "#D9C826" },
    "--nu-dark-gold": { rgb: [202, 124, 27], hex: "#CA7C1B" },
    "--nu-dark-orange": { rgb: [216, 88, 32], hex: "#D85820" },
};

/** The semantic colors northwestern-filament-theme defines today. */
const semantic: Record<string, string> = {
    "--nu-color-success": "#008656",
    "--nu-color-info": "#5091cd",
    "--nu-color-warning": "#ffc520",
    "--nu-color-danger": "#ef553f",
};

describe("tailwind.css", () => {
    const [theme, ...extraThemes] = parse("tailwind.css").nodes.filter(
        (node): node is AtRule => node.type === "atrule" && node.name === "theme",
    );
    const mappings = declarations(theme);
    const referenced = new Set(mappings.flatMap((decl) => varReferences(decl.value)));

    it("has a single @theme block", () => {
        expect(theme).toBeDefined();
        expect(extraThemes).toHaveLength(0);
    });

    it.each([...tokens.keys()])("maps %s to a Tailwind theme variable", (token) => {
        expect(referenced).toContain(token);
    });

    it.each(mappings.map((decl) => [decl.prop, decl.value]))("%s is a var() reference to a token", (_, value) => {
        const references = varReferences(value);
        expect(value).toBe(`var(${references[0]})`);
        expect(tokens.has(references[0])).toBe(true);
    });
});

describe("tokens.css", () => {
    it.each(Object.entries(published))("%s matches the published palette", (token, { rgb, hex }) => {
        const value = normalizeHex(tokens.get(token) ?? "");
        if (rgb) {
            expect(value).toBe(rgbToHex(rgb));
        }
        if (hex) {
            expect(value).toBe(normalizeHex(hex));
        }
    });

    it.each(Object.entries(semantic))("%s resolves to %s", (token, hex) => {
        expect(normalizeHex(resolve(tokens.get(token) ?? ""))).toBe(hex);
    });

    it("defines no colors beyond the published palette and the semantic colors", () => {
        const colors = [...tokens.keys()].filter((token) => !/^--nu-(font|border-radius)/.test(token));
        expect(colors.sort()).toEqual([...Object.keys(published), ...Object.keys(semantic)].sort());
    });
});

describe("fonts.css", () => {
    const fontPattern =
        /^https:\/\/common\.northwestern\.edu\/dept\/4\.0\/css\/fonts\/(akkurat|poppins|noto-serif)\/[a-z0-9-]+\.woff2$/;
    const faces: AtRule[] = [];
    parse("fonts.css").walkAtRules("font-face", (rule) => {
        faces.push(rule);
    });

    const describeFace = (face: AtRule) => {
        const get = (prop: string) => declarations(face).find((decl) => decl.prop === prop)?.value ?? "";
        return {
            family: get("font-family").replaceAll('"', ""),
            style: get("font-style"),
            weight: get("font-weight"),
            src: get("src"),
            display: get("font-display"),
        };
    };

    it("registers the 16 faces Department Templates 4.0 serves", () => {
        const counts = Object.groupBy(faces.map(describeFace), (face) => face.family);
        expect(Object.fromEntries(Object.entries(counts).map(([family, list]) => [family, list?.length]))).toEqual({
            "Akkurat Pro": 6,
            Poppins: 6,
            "Noto Serif": 4,
        });
    });

    it.each(faces.map(describeFace))(
        "$family $weight $style loads a dept/4.0 woff2 with font-display: swap",
        ({ src, display }) => {
            const urls = [...src.matchAll(/url\(\s*"([^"]+)"\s*\)/g)].map((match) => match[1]);
            expect(urls).toHaveLength(1);
            expect(urls[0]).toMatch(fontPattern);
            expect(src).toContain('format("woff2")');
            expect(display).toBe("swap");
        },
    );

    it("bundles no font files", () => {
        const fontFiles = readdirSync(cssDir, { recursive: true, encoding: "utf8" }).filter((file) =>
            [".woff", ".woff2", ".otf", ".ttf", ".eot"].includes(extname(file)),
        );
        expect(fontFiles).toEqual([]);
    });
});
