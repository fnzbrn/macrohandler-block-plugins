# Navigation V2 · 2.0.0

Draw a route on a saved full-map reference, close the full map, and follow that route using the live mini-map. Full-map tracking remains available as a separate mode.

[Download Navigation-V2.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/navigation-v2.0.0/Navigation-V2.mhblock) · [Türkçe kurulum rehberi](README.tr.md) · [Release](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/navigation-v2.0.0)

## Compatibility

This preview requires a Macro Handler build supporting **Navigation native API 2**, including the October 21 mini-map setup fixes. The reviewed host source is recorded in [manifest.json](manifest.json). App version **1.0.52 alone is not sufficient**: older builds with that version may lack these changes. This release does not publish an APK or update Google Play.

The small `.mhblock` file opens the navigation engine already installed in the app. It contains no executable engine, map, route, credentials or game assets. An older app rejects the API 2 descriptor and asks for an update.

## Import

1. Download **Navigation-V2.mhblock** to the Android device. Do not import GitHub's source ZIP.
2. Open a copy of your macro in the No-Code or Logic workspace.
3. Select **Add Block → Import block (.mhblock)** and review **Navigation V2 / 2.0.0**.
4. Add **Navigation V2** from **Plugins**. Its native package ID remains `com.macrohandler.navigation`; version 2.0.0 is a separate library version. Importing it does not rewrite existing V1 blocks or their settings.
5. If needed, import the unchanged [Navigation Stop](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation_stop.mhblock) separately.

## Mini-map setup

1. Select **Mini-map tracking** on the block card, then open **Map and route setup**. New V2 blocks start in mini-map mode with heading feedback.
2. Open **Reference map** and save/select the full map. Capture the terrain without window borders or buttons.
3. Draw and save the route on that reference using the app's route editor.
4. Close the game's full map. Open **Mini-map setup**, select the visible mini-map region and confirm it. Continue in the same setup panel; teach the player's mini-map marker and its heading tip separately. Confirm the setup before leaving it.
5. Choose the circular/rectangular shape. Use the edge margin and exclusion areas to omit the frame and fixed controls. Choose **Fixed at center** if the player arrow stays centered; otherwise choose the moving-player option.
6. Configure the joystick. Verify position and heading with the non-moving observation test before trying a short live route.

Only the selected source's setup controls are shown. **Full-map tracking** retains its live map region and marker setup. Switching sources preserves saved map, route and source settings; measured calibration is not transferred between sources.

## Tracking behavior

- Position comes from matching mini-map terrain to the reference map. Heading comes from the taught player arrow, with rotation mapped into reference coordinates.
- Centered-player mode narrows marker search; it still requires a visible marker and a valid terrain match.
- Missing, ambiguous or stale observations release movement. Brief heading uncertainty may recover through bounded fresh observations; unresolved uncertainty stops navigation.
- Navigation follows the drawn route. It does not discover walls or automatically plan detours around obstacles.
- Keep screen geometry consistent with setup. Occlusion, repeated terrain, sparse detail or a different map style may prevent localization.

## Verification and V1

The current host's mini-map region return fix passed 625 JVM tests and 8 Android UI scenarios, including region/exclusion save/cancel, persisted reopening, marker selection and both tracking modes in portrait/landscape. Normal LDPlayer use also retained the selected region. These checks do not establish a full-route acceptance test for every game or a physical-device result. Earlier live-game evidence covered only a bounded route segment; test your own route on your device.

The original [V1 release v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/v1.1.0), its files and checksums remain unchanged. Keep your V1 macro copy for rollback. Both versions use the engine supplied by the installed application.

Compare downloads against [SHA256SUMS](SHA256SUMS). The repository's MIT license covers these descriptors and guides, not the Android engine or third-party game assets.
