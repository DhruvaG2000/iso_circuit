# Nano Atlas

Local 3D explorer for the original Arduino Nano 33 BLE Sense (ABX00031) and BeaglePlay. Use the board dropdown in the header to switch.

Run `node server.cjs`, then open http://localhost:4173. The server listens only on this computer. Three.js and OrbitControls are vendored locally; the explorer does not need a CDN connection.

Drag to rotate, scroll/pinch to zoom, right-drag to pan. Click a component or use the component index. Click a net in the inspector to isolate it. The explode slider separates packages; Bottom exposes debug pads and solder jumpers.

## Scope and sources

Educational geometry, approximate component placement, functional electrical nets, 30 selectable headers, and grouped passive support circuits. This is not a complete manufacturing CAD or copper-routing reconstruction. No hardware connection or simulated sensor readings.

- Arduino Nano 33 BLE Sense: https://docs.arduino.cc/hardware/nano-33-ble-sense/
- Schematic (V4.0, included as dist/schematic.pdf): https://docs.arduino.cc/resources/schematics/ABX00031-schematics.pdf
- Pinout: https://docs.arduino.cc/resources/pinouts/ABX00031-full-pinout.pdf
- Core pin definitions: https://github.com/arduino/ArduinoCore-mbed/blob/main/variants/ARDUINO_NANO33BLE/pins_arduino.h

Hardware schematic attribution: Arduino, CC BY-SA 4.0. The model follows the linked V4.0 schematic for part and jumper designators. Microphone and regulator packages can differ by production revision. U4 is DNP in that schematic; it is not modeled as a fitted crypto IC. Sense Rev2 uses different sensors and is not represented here.

Three.js is distributed under its MIT license: https://github.com/mrdoob/three.js/blob/r170/LICENSE

## BeaglePlay

Open http://localhost:4173/?board=beagleplay directly. The model has 56 selectable parts, circuit groups, connectors and mikroBUS contacts, and 53 logical connection paths. Major chips are on the back; selecting them from the index turns the board over. Front/back controls and the explode slider are shared with the Nano explorer.

BeaglePlay connections include grouped parallel buses, differential lanes, power rails, and support circuits. They are functional explanations, not a complete pin-level netlist. Separate power rails shown in one bundle are not electrically shorted. Shapes and placement are approximate.

Sources: BeagleBoard.org documentation, CC BY-SA 4.0:

- https://www.beagleboard.org/boards/beagleplay
- https://docs.beagleboard.org/boards/beagleplay/01-introduction.html
- https://docs.beagleboard.org/boards/beagleplay/03-design.html
- https://docs.beagleboard.org/boards/beagleplay/04-expansion.html
- Bus assignments cross-checked against https://github.com/torvalds/linux/blob/master/arch/arm64/boot/dts/ti/k3-am625-beagleplay.dts

Run `node verify.mjs` for dataset integrity, Three.js geometry, representative raycasts, component selection, explosion, visibility controls and dropdown navigation checks. These run with a stubbed DOM/renderer and do not replace browser visual testing.

## Development and repository

Requires Node.js 22 or newer. No dependency installation or build is needed.
Run `npm start` to serve the site and `npm test` for the existing verification suite.
The `dist/` folder contains the actual website source and is intentionally committed,
including its local Three.js dependency and schematic. Root-level images, saved
reference pages and the device tree are supporting research materials.
`extend-renderer.py` is a historical editing helper, not a required build step.

To push this repository to a new empty remote:

```sh
git remote add origin <your-repository-url>
git push -u origin HEAD
```

## License

Original Nano Atlas code is licensed under MIT; see [LICENSE](LICENSE).
MIT permits commercial use, modification and redistribution with its notices retained.
Third-party software and hardware reference materials retain their own licenses;
see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution and scope.
