# Local vision: faster preparation and safer cancellation

Date: 2026-10-13. Latest verified host source:
`50db7fe670a0335a3f7d6f4e6c7c23c3e3751459` (1.0.52 debug/test build).
Plugin descriptor **1.2.0 preview** and its existing release assets are unchanged.
Updating the descriptor alone does not update the Android runtime. This is not a
Google Play release or an all-device performance certification.

## Retained fixes

- Import and download already hash the entire approved model. The updated host
  retains that process-local verification receipt instead of reading the full files
  again at first use. Changed files and process restart still require full SHA-256
  verification. Model pins, size checks and license consent remain mandatory.
- Stop/deadline checks now occur during checksum reads, allowing a cancelled cold
  request to finish without unnecessarily reading the rest of a large file.
- Stop/deadline are checked again after a completed response is received. Late or
  interrupted output cannot be used as a successful model answer. Configured Error
  handling remains available.

Weights, image quality, output limits, model choices, fresh-frame behavior and
True/False/Unknown/Error meanings have not changed. The earlier bounded exact-frame
optimization remains. Screenshots are not saved by the inference path.

## Measured and checked

On Samsung SM-A055F/Android 14/ARM64 and LDPlayer/Android 14/x86_64:

- 54/54 focused JVM tests and 16/16 final device methods passed.
- All 52 expected answers matched across four models' owned synthetic scenarios.
- Generated actions, stop, deadlines, recovery, profile switching and bounded OCR
  arithmetic passed. No fatal/ANR was observed in accepted test windows.
- An intact just-imported model pair required zero hash-read probes: 3 ms on
  Samsung and 1 ms on LDPlayer. For comparison, forcing re-verification of the
  175,054,528-byte language file took 331 and 486 ms. These are verification-path
  timings, not complete inference latency.
- Cancelled checks did not publish verification. A one-byte modification with
  unchanged file size was rejected; restoring and re-verifying recovered correctly.
  These checks modified only disposable app-private test copies.

[Expected/actual observations and build digests](../local-vision-preparation-evidence.json).

## Speed limits remain explicit

Warm mixed medians were approximately 1.66 s for LFM and 6.21 s for Smol500 on
Samsung, 1.71 s for Smol256 and 7.35 s for Qwen on LDPlayer. No general inference
acceleration is claimed for this follow-up. A separate worker-pool experiment did
not establish consistent benefit and was reverted.

The gain is removal of duplicate file preparation after successful import/download,
plus faster cancellation of abandoned work. Larger models still exceed 1–3 seconds
on these devices. Prior arithmetic/message accuracy limitations, arbitrary real-game
recognition, all-language accuracy, full user-owned MediaProjection workflows and
24-hour endurance remain outside this validation.

[Installation and task selection](local-visual-decision.md) ·
[Earlier exact-frame performance results](local-visual-performance.md) ·
[Download the preview](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/local-vision-v1.2.0)
