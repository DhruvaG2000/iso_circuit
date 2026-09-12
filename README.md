# BeaglePlay — Inside the board

A static, interactive 3D explorer dedicated to BeaglePlay. The browser loads a compressed 5.3 MiB model with 798 individually selectable component assemblies, original PCB silkscreen, material grain, plated connectors and chip markings.

Rotate, zoom, pan, switch front/back views, explode the assembly, isolate a part, or follow functional connection paths. Search references, functions and manufacturer part numbers. The inspector includes the published BOM, verified TI datasheet links where available, and Mouser/DigiKey searches.

## Run locally

Requires Node.js 22 or newer. Runtime dependencies are included in `dist`; no package installation or CAD software is needed to view the site.

```sh
npm start
```

Open **http://localhost:4173/**. `PORT` and `BASE_PATH` can override the port and mount path for testing. Run `npm test` to validate assets, module dependencies, component data and serving beneath a repository path.

## Deploy with GitHub Actions / GitHub Pages

1. Push this repository to GitHub with the site on `main` or `master`.
2. In the repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Deploy BeaglePlay Explorer** from the Actions tab, or push another commit to the configured branch.

The included `.github/workflows/pages.yml` validates the committed static files, uploads `dist`, and deploys to the `github-pages` environment. The deployment job reports the public URL. Relative asset paths support both `username.github.io/repository/` and a custom domain. No backend, API keys, CDN, Blender installation or CAD conversion is required on GitHub Actions.

This change prepares the workflow; it does not itself push or publish the repository. GitHub setup follows the [official Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Model provenance and limits

- Geometry: official `Design/beagleplayv10_a2_board_3D_20221219.stp`. Empty assembly placeholders are resolved before triangulating each distinct package. Instance transforms preserve the original placements.
- PCB: February 2023 Gerber silkscreen/solder-mask artwork rendered at 4096 × 4096. The rounded substrate and mounting holes are reconstructed; minor revision/placement differences can exist.
- U5 Wi-Fi module: reconstructed from its documented package dimensions and official placement. Connector inserts, surface materials and laser markings are visual additions. This is a rendered CAD model, not a photogrammetry scan or a manufacturing inspection tool.
- Catalog: all 725 published BOM references are searchable. The CAD also contains extra references; unmatched entries are identified. Thirteen BOM references lack corresponding 3D geometry and remain inspectable as “BOM only”.
- Connection paths show functional bus/rail bundles. They are **not physical copper routes**, and individual passive nets are not mapped. Exact wiring remains in the linked official schematic.
- Distributor links are part-number searches, not verified stock listings. Some manufacturer part numbers contain source-BOM variant suffixes. Parts without a verified direct datasheet link say so.

Source hardware: [BeaglePlay design repository](https://openbeagle.org/beagleplay/beagleplay), [board photographs and component documentation](https://docs.beagleboard.org/boards/beagleplay/01-introduction.html), and [official board page](https://www.beagleboard.org/boards/beagleplay).

## Rebuild the CAD assets (optional)

The committed GLB is ready to serve. To regenerate it, install the development dependencies with pnpm, then run:

```sh
node download-sources.mjs
node split-step.mjs
node convert-split.cjs
node build-artwork.mjs
node build-bom.mjs
node build-model.mjs
node optimize-model.mjs
node verify.mjs
```

The 57 MB source STEP and intermediate triangulations are excluded from Git. Engineering source files and attribution are retained in `assets-source`. The converter uses OpenCascade via `occt-import-js`; the browser uses only the optimized GLB and vendored Three.js/Meshopt code.

Original application code is MIT licensed. Hardware-derived assets are CC BY 4.0; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the included upstream license.
