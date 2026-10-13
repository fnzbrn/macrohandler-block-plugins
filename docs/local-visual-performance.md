# Local AI Visual Decision: performance and stability follow-up

Date: 2026-10-13. Optional plugin: **1.2.0 preview**. Optimized Android host source:
`631f0475280eaff129dbf05959dde57dcc19ac0f` (1.0.52 development build).
This is not a Google Play release announcement. The existing versioned plugin
descriptor and release assets remain unchanged. Importing the descriptor into an
older APK does not update its native runtime.

## What changed

The updated host can reuse image embeddings for the **same exact current frame**,
including all image tiles. This avoids repeating vision encoding when asking a
different question about unchanged pixels. Width, height, pixels and embedding
shapes must match. The cache is bounded to 16 MiB of embeddings plus at most
512 x 512 x 3 RGB bytes. A changed frame replaces it; model/projector switching,
idle release and incomplete encoding clear it. Prompts, decisions, answers and
language-model state are never reused. Every question gets a fresh model context.

The host also releases the old model and projector before loading a different
pair, avoiding unnecessary simultaneous residency during model switching. Model
weights, image resolution, task defaults, token limits, licenses and branch
semantics have not changed. Thread-count experiments that slowed work were reverted.

Each invocation captures and analyzes one region frame. It does not continuously
watch the screen between invocations. This path does not write captured screenshots
to disk; current-frame RAM data is bounded and is released after inactivity.
Downloaded model weights intentionally remain installed until removed.

## What was tested

- Samsung SM-A055F, Android 14, ARM64: LFM2.5-VL-450M and SmolVLM-500M.
- LDPlayer, Android 14, x86_64: SmolVLM-256M and Qwen3-VL-2B. An emulator result
  is not evidence for a physical phone; Qwen was not tested on this low-memory Samsung.
- Owned scenes: red/blue shape, green/disabled button, synthetic monster/human/empty
  scene, reading the word BLUE, changed question with identical pixels, changed
  pixels with the same question, and returning to a previous frame.
- 52/52 expected answers matched in these new fixtures. Eight model-scenario methods
  and six additional device methods passed: generated native/compatibility branches,
  stop, deadlines, draining, profile switching, and arithmetic. Total: **14 methods**.
- 50 focused JVM tests passed. Native cache checks passed on both ABIs, including
  exact-byte invalidation, partial encoding, allocation bounds and 1,000 cache
  replacements. These are not 1,000 model inferences or a 24-hour endurance run.
- No fatal/ANR or captured-image file growth was observed in accepted test windows.

[Machine-readable expected/actual evidence](../local-vision-performance-evidence.json)
includes timings, artifact digests and limitations. Protocol success is distinct
from correct model answers. Previous wrong generative arithmetic answers and
complex-message failures remain valid; these new fixtures do not erase them.

## Measured speed

Times are milliseconds from paired controlled observations. Mixed warm medians
exclude the first cold text and first cold red-circle requests. Initial checksum
verification occurred before these timed probes. These are not statistical SLAs.

| Model / device | Mixed warm median before -> after | Same multi-tile image, positive question | Same multi-tile image, negative question |
| --- | --- | --- | --- |
| LFM450 / Samsung | 1663 -> 1660 | 740 -> 730 | 725 -> 728 |
| Smol256 / LDPlayer | 1735 -> 1736 | 4322 -> 465 | 3177 -> 1394 |
| Qwen2B / LDPlayer | 7541 -> 7377 | 6648 -> 5575 | 6370 -> 5648 |
| Smol500 / Samsung | 5511 -> 6268 | 8324 -> 8314 | 8331 -> 2038 |

Same-frame cases improved, but **not every model or workload became faster**.
Smol500's mixed median was slower and varied substantially. The cause of that
variation was not established. New frames still require vision encoding. LFM's
changed-frame binary cases were approximately 1.65-1.67 seconds on Samsung;
the cold red-circle request took 3.249 seconds. There is no universal 1-3 second
guarantee, especially for larger models or cold loading.

## Arithmetic and failure behavior

Explicit **Arithmetic OCR** correctly produced `-5` for `8 - 13`, `2.5` for
`(8 + 2) / 4`, and `42` for both `12 + 30` and `6 * 7`. Division by zero,
an equation containing `=`, prose and a blank image returned Unknown. All eight
cases passed on each device. The four supported expressions took 585, 126, 125
and 132 ms on the final Samsung run. This mode is OCR plus a bounded expression
evaluator, not a generative model and not a solver for arbitrary math problems.

A one-second request can legitimately time out. The checked behavior is bounded
return, no usable partial answer, safe worker draining and successful recovery on
the next request. No runtime deadline was relaxed to make a test pass. Configure
Unknown and Error branches explicitly; do not turn missing output into False or
perform a tap based on a partial answer.

## Choosing and using a profile

Use the per-block model selector to choose the profile you tested on the intended
device. LFM was the fastest tested physical-device binary profile; its license
acceptance remains explicit. Choose Arithmetic OCR for supported expressions.
Qwen and Smol500 remain options for evaluated tasks where their extra latency is
acceptable. The app does not silently route requests to another model or the cloud.

Use a tight region and a short concrete prompt, and test positive, negative,
Unknown and Error cases on your own screen. This plugin does not provide exact
pixel comparison, object bounding boxes or a guaranteed real-game detector.
Accuracy for arbitrary messages, all 14 languages, all Android/OEM devices,
full user-owned MediaProjection macros and 24-hour unattended use remains unverified.

[Read the installation and task guide](local-visual-decision.md) and
[download the preview plugin](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/local-vision-v1.2.0).
