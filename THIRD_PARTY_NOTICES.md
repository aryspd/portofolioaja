# Third-party notices

This portfolio includes locally hosted third-party software and fonts. The portfolio owner's content and photographs are separate from these dependencies.

| Dependency           | Version           | License / source                                             |
| -------------------- | ----------------- | ------------------------------------------------------------ |
| Tailwind CSS         | 4.3.3             | MIT — `licenses/tailwindcss-LICENSE.txt`                     |
| daisyUI              | 5.7.47            | MIT — `licenses/daisyui-LICENSE.txt`                         |
| Alpine.js            | 3.17.4            | MIT — `licenses/alpine-LICENSE.txt`                          |
| GSAP / ScrollTrigger | 3.15.0            | GSAP Standard License: https://gsap.com/standard-license/    |
| Space Grotesk        | @fontsource 5.3.0 | SIL Open Font License — `licenses/space-grotesk-LICENSE.txt` |
| DM Sans              | @fontsource 5.3.0 | SIL Open Font License — `licenses/dm-sans-LICENSE.txt`       |
| IBM Plex Mono        | @fontsource 5.3.0 | SIL Open Font License — `licenses/ibm-plex-mono-LICENSE.txt` |

GSAP distribution headers containing its copyright, author, and license reference are retained in `assets/vendor/gsap.min.js` and `assets/vendor/ScrollTrigger.min.js`. Icons and project illustrations are drawn directly in the site's SVG/CSS; there is no remote icon-font dependency.

Dependency versions and build inputs are pinned by `package-lock.json`. Tailwind CSS and daisyUI are build-time dependencies; their compiled CSS is included in the download. YouTube and Google Drive media remain externally hosted by their original providers.
