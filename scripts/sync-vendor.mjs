import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const copy = (source, target) =>
  copyFileSync(resolve(root, source), resolve(root, target));
mkdirSync(resolve(root, "assets/vendor"), { recursive: true });
mkdirSync(resolve(root, "assets/fonts"), { recursive: true });
copy("node_modules/alpinejs/dist/cdn.min.js", "assets/vendor/alpine.min.js");
copy("node_modules/gsap/dist/gsap.min.js", "assets/vendor/gsap.min.js");
copy(
  "node_modules/gsap/dist/ScrollTrigger.min.js",
  "assets/vendor/ScrollTrigger.min.js",
);
for (const [family, weights] of [
  ["space-grotesk", [500, 700]],
  ["dm-sans", [400, 600]],
  ["ibm-plex-mono", [400]],
]) {
  for (const weight of weights) {
    const file = `${family}-latin-${weight}-normal.woff2`;
    copy(
      `node_modules/@fontsource/${family}/files/${file}`,
      `assets/fonts/${file}`,
    );
  }
}
console.log("Vendor scripts and fonts copied locally.");
