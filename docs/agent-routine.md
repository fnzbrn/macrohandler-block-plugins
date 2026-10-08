# Agent Routine

Prepare and run taught routines from the Agent editor.

[Download agent_routine.mhblock (v1.1.0)](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/agent_routine.mhblock)

The link above downloads the actual **.mhblock** file. Do not import the repository source ZIP into Macro Handler.

## What it does

Opens the existing Agent editor; Routine is a workflow inside that editor. Teaching, approval and launch checks remain enforced by the same engine.

## Requirements

- Macro Handler with native block package schema **2**, API **1**, and the four-entry package catalog introduced for release **1.1.0**. App marketing version 1.0.51 by itself does not prove compatibility.
- The visual or logic workspace.
- Screen capture and accessibility permissions when required by your chosen action. Membership requirements remain in force.

## Import and use

1. Download **agent_routine.mhblock** to the Android device.
2. Open your macro in the visual or logic workspace.
3. Open **Add Block**, select **Import**, and choose the .mhblock file.
4. Verify the package identity and version, then confirm import.
5. Add **Agent Routine** from **Plugins**.
6. Add Agent Routine from Plugins. Prepare targets and the routine in the Agent editor, complete required approvals and inspect the preview before running.

[Open the complete block setup guide](https://macrohandler.com/docs/visual-guide/agent)

## Limits and safe testing

This is distinct from Agent Detect. It does not bypass approvals or execution permissions, or download third-party models.

Test the configured block on a copy of your macro before using it in a live task. Importing a package does not configure your targets, regions, routines or joystick automatically.

## Updates and integrity

Release assets are versioned. Keep the previous package for rollback; review the release notes and version before importing an update. The published SHA-256 checksums verify file integrity; they are public fingerprints, not secrets.

[All release versions](https://github.com/fnzbrn/macrohandler-block-plugins/releases) · [Checksums for v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/SHA256SUMS)

## Community and support

[Comments and reactions for this plugin](https://macrohandler.com/plugins/agent-routine#plugin-discussion). Posting and voting require sign-in, an active Community Badge and current community policy acceptance. Saving and favoriting a plugin require sign-in.

[Macro Handler website](https://macrohandler.com) · [Google Play](https://play.google.com/store/apps/details?id=com.macrohandler.app) · [LuaLS definitions](https://github.com/fnzbrn/macrohandler-lua-definitions)
