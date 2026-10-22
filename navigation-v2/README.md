# Navigation V2 · 2.0.1

Draw routes on a saved full-map reference and follow them with either the full map or the live mini-map. The updated Android host supplies the route editor, terrain/marker matching and joystick control.

[Download Navigation-V2.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/navigation-v2.0.1/Navigation-V2.mhblock) · [Türkçe rehber](README.tr.md) · [Release](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/navigation-v2.0.1)

## Compatibility and update

Use a host with **Navigation native API 2** and the October 22 route management, joystick sway and group-selector updates. The exact reviewed Android source commit is in [manifest.json](manifest.json). **Version name 1.0.52 alone is insufficient**: earlier builds with that name may lack these changes.

This small descriptor opens the engine already installed in Macro Handler. It does not download executable engine code, include game assets or update the Android app/Google Play. Reimporting a plugin cannot add host features to an older app.

1. Keep a copy of the current macro. Download **Navigation-V2.mhblock**, not GitHub's source ZIP.
2. In the No-Code or Logic workspace choose **Add Block → Import block (.mhblock)**.
3. Review **Navigation V2 / 2.0.1** and add it from **Plugins**.
4. The package ID remains **com.macrohandler.navigation**. The new library version coexists with V1 and V2 2.0.0; importing it does not rewrite existing macro blocks or saved setups.
5. [Navigation Stop](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation_stop.mhblock) remains a separate, unchanged block.

Screen capture and accessibility permissions are required for the actions used. Existing membership and runtime authorization rules still apply.

## Source-specific setup

Choose **Full-map tracking** or **Mini-map tracking** on the block, then **Map and route setup**. Only that source's controls appear. Switching sources preserves their saved settings; calibration is source-specific.

For mini-map tracking:
1. Save/select a clean full-map reference containing terrain, without window borders or buttons.
2. Open **Routes and points → New route**. Draw and save the route on that reference.
3. Close the game's full map and select the visible mini-map region. Use circular/rectangular shape, edge margin and exclusion regions to omit decoration.
4. Teach the mini-map player arrow separately, marking its position anchor and heading tip.
5. If the arrow stays centered, choose **Fixed at center**; otherwise choose moving-player mode. Centered mode still requires a real visible arrow.
6. Set the joystick region. Start with **Observe without moving** and verify position/heading before a short route.

Reference and mini-map pixel dimensions do not need to match: scale and rotation are estimated from common terrain. Sparse, repeated or occluded terrain can still prevent a reliable match.

## Saved routes

The main route panel contains **New route**, **Route preview**, and **Selected route**, vertically. Preview sends no movement.

Selected route opens a scrollable list with route names, point counts and waypoint-group counts. Tap a row, then **Select route** to apply it. Cancel keeps the previous selection. Edit opens the selected route; Delete requires confirmation naming that route.

Deletion removes only the selected route and its waypoint assignments. It preserves the map, calibration, other routes and macro groups. If the active route is deleted, no other route is silently selected. Other blocks referencing it need explicit reselection. Stale edits cannot overwrite newer profile revisions. Up to 32 routes can be saved per setup.

## Camera, joystick and diagnostics

For a camera that does not automatically follow the character, choose **Movement mode and settings → Live heading settings → Fixed camera**. Specify the reference-map direction produced by joystick UP: right 0°, down 90°, left 180°, up 270°. A horizontal reflection option is available. Reconfigure after changing camera orientation; no single angle is correct for every game.

Optional **Joystick sway** is off by default. Strength is 0–15° and period is 400–10000 ms. It varies the admitted direction without increasing joystick radius. Direction learning, route correction and arrival approach take priority; calibration is unaffected.

Observation and calibration use a persistent draggable diagnostic panel with its stop action inside the panel. Observation does not send joystick movement. Calibration does move the joystick: use a clear area.

## Groups in both tracking modes

Create the group in the same macro first. **Group calls** shows named choices:
- **Waypoint action**: select a route point, group and radius, then save. Navigation releases the joystick, runs the group and reacquires a fresh position before continuing.
- **Periodic group / pause mode**: stop, run the chosen group, reacquire and resume.
- **Periodic group / observation mode**: steering continues while the chosen group performs observation work. Callbacks run one at a time; fresh samples replace queued old samples. This is not unrestricted concurrent screen control. Use pause mode for touch actions, or explicitly stop navigation and confirm release first.

Missing groups, failed callbacks, missing maps and unresolved headings are not treated as success.

## Verification and limits

The October 22 audit freshly passed **680 app + 200 core JVM navigation tests** and **60 Android instrumented tests** on LDPlayer, covering both sources, native image matching, callback execution, stop cleanup, route persistence, archive transfer and editor lifecycle. Additional exact-package import verification is recorded in the manifest.

These are scoped automated tests, not full-route acceptance on every game or a physical-device certification. Earlier real-game traces demonstrated bounded movement, not a completed end-to-end route. Low-detail terrain remains a localization limitation. If measured position uncertainty exceeds the authored arrival radius, arrival is refused; do not weaken recognition gates or silently widen the user's route tolerances.

Navigation follows an authored route. It does not discover walls or plan obstacle detours. Missing, ambiguous or stale evidence stops/releases movement. Test your own reference, marker, camera, joystick and short route before longer use.

## Release notes and rollback

**2.0.1 (2026-10-22):** refreshed descriptor and compatibility record; documented saved-route selection/deletion, fixed camera, joystick sway, shared group choices and the persistent diagnostic panel. Exact-package import is checked alongside V1. These features are supplied by the reviewed host; the descriptor is not an engine patch.

[V2 2.0.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/navigation-v2.0.0) and [V1 v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/v1.1.0) retain their original files. Keep your old macro copy. Compare downloads with [SHA256SUMS](SHA256SUMS).

The repository MIT license covers descriptors and guides, not the Android engine or third-party game assets.
