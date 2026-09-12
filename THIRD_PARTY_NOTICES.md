# Third-party notices

The root MIT license covers original BeaglePlay Explorer software. It does not relicense third-party code, hardware designs, photographs or documentation.

## BeaglePlay hardware — CC BY 4.0

Copyright (c) 2023 Seeed Technology Co., Ltd.
Copyright (c) 2023 BeagleBoard.org Foundation.

Source: https://openbeagle.org/beagleplay/beagleplay
License: https://creativecommons.org/licenses/by/4.0/
Full upstream text: `assets-source/HARDWARE-LICENSE.txt` and `dist/assets/HARDWARE-LICENSE.txt`.

Files: official BOM, Gerber artwork, component-location workbook in `assets-source`; derived `dist/assets/beagleplay.glb`, PCB textures, component catalog and assembly metadata. Changes: STEP assembly extraction, tessellation, coordinate conversion, compressed glTF packaging, applied artwork, reconstructed PCB/U5 body, additional connector inserts, labels and rendering materials. CAD and artwork originate from different dated revisions as stated in README and the website.

`dist/assets/routing.json` is also derived from the CC BY 4.0 BeaglePlay hardware: the official Altium export named in README. Changes include extracting named nets, pads, vias and tracks, sampling arcs, and transforming coordinates into the viewer. The source PCB database is downloaded by `download-sources.mjs` and excluded from Git.

## Three.js r170 — MIT

Files: `dist/vendor/three.module.js`, `OrbitControls.js`, `GLTFLoader.js`, `BufferGeometryUtils.js`, `RoomEnvironment.js`.
Copyright (c) 2010–2024 three.js authors. Full text: `dist/vendor/LICENSE`.
Source: https://github.com/mrdoob/three.js/tree/r170

## Meshoptimizer 1.2 — MIT

File: `dist/vendor/meshopt_decoder.js`.
Copyright (c) 2016–2026 Arseny Kapoulkine.
Full text: `dist/vendor/MESHOPT-LICENSE.md`.
Source: https://github.com/zeux/meshoptimizer

## BeagleBoard.org documentation and photographs

Saved reference files: `beagle-front.webp`, `beagle-back.webp`, `beagle-block.svg`.
Attribution: BeagleBoard.org and the respective credited contributors.
Documentation license: CC BY-SA 4.0; separately credited embedded materials retain their own terms.
Sources: https://docs.beagleboard.org/boards/beagleplay/01-introduction.html and https://docs.beagleboard.org/boards/beagleplay/03-design.html

## Linux BeaglePlay device tree

File: `beagleplay.dts`. SPDX: GPL-2.0-only OR MIT; this project uses the MIT option.
Copyright (C) 2022–2024 Texas Instruments Incorporated.
Copyright (C) 2022–2024 Robert Nelson, BeagleBoard.org Foundation.
Source: https://github.com/torvalds/linux/blob/master/arch/arm64/boot/dts/ti/k3-am625-beagleplay.dts

Board and manufacturer names and marks belong to their respective owners. No affiliation or endorsement is implied.
