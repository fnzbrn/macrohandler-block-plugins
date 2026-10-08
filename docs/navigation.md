# Navigation

Manage route and joystick steps in an editable block.

[Download navigation.mhblock (v1.1.0)](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation.mhblock)

The link above downloads the actual **.mhblock** file. Do not import the repository source ZIP into Macro Handler.

## What it does

Use the existing Navigation engine’s route, target and joystick settings in the visual and logic workspaces. This package opens the built-in engine’s block editor.

## Requirements

- Macro Handler with native block package schema **2**, API **1**, and the four-entry package catalog introduced for release **1.1.0**. App marketing version 1.0.51 by itself does not prove compatibility.
- The visual or logic workspace.
- Screen capture and accessibility permissions when required by your chosen action. Membership requirements remain in force.

## Import and use

1. Download **navigation.mhblock** to the Android device.
2. Open your macro in the visual or logic workspace.
3. Open **Add Block**, select **Import**, and choose the .mhblock file.
4. Verify the package identity and version, then confirm import.
5. Add **Navigation** from **Plugins**.
6. After importing, add Navigation from Plugins. Configure the joystick centre, route and stop conditions on your own screen; test a short route first.

[Open the complete block setup guide](https://macrohandler.com/docs/visual-guide/navigation)

## Limits and safe testing

Joystick and camera behaviour varies between games. No universal game route is included.

Test the configured block on a copy of your macro before using it in a live task. Importing a package does not configure your targets, regions, routines or joystick automatically.

## Updates and integrity

Release assets are versioned. Keep the previous package for rollback; review the release notes and version before importing an update. The published SHA-256 checksums verify file integrity; they are public fingerprints, not secrets.

[All release versions](https://github.com/fnzbrn/macrohandler-block-plugins/releases) · [Checksums for v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/SHA256SUMS)

## Community and support

[Comments and reactions for this plugin](https://macrohandler.com/plugins/navigation#plugin-discussion). Posting and voting require sign-in, an active Community Badge and current community policy acceptance. Saving and favoriting a plugin require sign-in.

[Macro Handler website](https://macrohandler.com) · [Google Play](https://play.google.com/store/apps/details?id=com.macrohandler.app) · [LuaLS definitions](https://github.com/fnzbrn/macrohandler-lua-definitions)
