# Local AI Visual Decision — 1.0.52 preview

Add an **offline visual yes/no decision** to Macro Handler's No-Code or Logic
workspace. Choose a screen region, ask a short question, and connect your own
True, False, Unknown and Error actions.

[Download local_visual_decision.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/local-vision-v1.1.0/local_visual_decision.mhblock)
· [Release, checksums and test results](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/local-vision-v1.1.0)

**Compatibility: requires a 1.0.52 build containing the reviewed local-vision API.**
This is a preview for that build, not a claim that the current Play version has the
API. Earlier 1.0.51 builds must not be treated as compatible. Package version 1.1.0
and app version 1.0.52 are separate version numbers.

## What is downloaded

The `.mhblock` file is a small, inspectable JSON **plugin descriptor**. Import it
only when you want this entry in Plugins. The model is **not embedded in the APK
or in this package**; you install the reviewed model data separately from the block
settings. No account/API key or paid cloud inference is needed.

The installed Android app provides the reviewed CPU runtime and editor APIs. This
is **not** a downloadable native engine, APK, DEX, JAR or arbitrary `.so` loader.
Importing the descriptor does not install executable Android code or start a macro.
Your macros store their own configured block copies; removing a library entry does
not delete those copies.

## Install and configure

1. Download the individual **local_visual_decision.mhblock** file; do not import
   the GitHub source ZIP.
2. In a compatible Macro Handler build, open **Add block → Import** and review
   package ID `com.macrohandler.local_visual_decision`, version `1.1.0`, schema 2,
   native API 1. Confirm import, then add it from **Plugins**.
3. Open the block settings. For the measured fast path, select **Local model →
   LFM2.5-VL-450M**. Read the linked **LFM Open License v1.0** and accept it only
   if its conditions apply to your use. Download/import its verified model pair
   (322,126,432 bytes, approximately 322 MB). Its license has commercial eligibility
   conditions; it is not Apache-2.0 or unrestricted open source. We do not redistribute
   these weights in the GitHub release.
4. Existing blocks retain **SmolVLM-256M** unless you explicitly select another
   profile. Its Apache-2.0 Q8 model/projector pair is 278,824,384 bytes (279 MB).
   Never mix model/projector files from different profiles.
5. Select a tight region containing the object you want to inspect. Ask a short
   English yes/no question, such as `Is a monster visible?` or `Is the large button green?`.
   Prompts can use the existing variable picker/bindings.
6. Configure **True**, **False**, **Unknown** and **Error** branches. Add your own
   click, swipe, group or other blocks. Configure their coordinates yourself: this
   profile does not return object bounding boxes or click positions.
7. Start with one attempt and confidence threshold **0**. The returned confidence
   is 0 because it is **not calibrated**. Do not turn it into a percentage or set a
   positive threshold expecting reliable probabilistic filtering.
8. Test positive and negative cases on your exact device and screen. Use normal
   stop controls. Do not assume a successful example proves arbitrary game behaviour.

Requirements: a 64-bit ARM64 or x86_64 Android process, sufficient free storage/RAM,
and the app's screen-capture/accessibility permissions for your selected actions.
The same block editor follows the workspace theme and the app's 14 UI languages.
UI translation does **not** establish equivalent model understanding of all 14 languages.
Custom names, prompts and variable identifiers are preserved; English questions
are recommended.

## Actual capability checks — 13 October 2026

The same 18 owned raster fixtures were run with the actual fast model on physical
**Samsung SM-A055F / Android 14 / ARM64** and **LDPlayer / Android 14 / x86_64**.
Expected and actual answers, including mistakes, are retained in the release evidence.
A completed probe is not the same as passing an accuracy acceptance gate.

| Scenario | Samsung | LDPlayer | Conclusion |
| --- | --- | --- | --- |
| Large red circle at 192, 384 and 768 px | 3/3 | 3/3 | Recognized these resolution variants. |
| Large blue dot / no blue dot | 2/2 | 2/2 | Recognized these coarse visual differences. |
| One blue pixel in a red circle | 0/1 | 0/1 | **Not suitable for exact single-pixel detection.** |
| Large centre hole / solid circle | 2/2 | 2/2 | Recognized these coarse shape differences. |
| Owned monster sprites, empty scene, human and rock | 5/5 | 5/5 | Worked on this small synthetic set, not a real-game guarantee. |
| Arithmetic yes/no: `8+5` and `6×7`, right/wrong proposed answers | 2/4 | 2/4 | Both correct proposed results were rejected. **Do not use this model as a maths verifier.** |
| Numeric extraction from `6×7` | 0/1 | 0/1 | Returned `Yes`, not `42`; this yes/no API has no numeric-answer mode. |

These are original test sprites, **not** benchmark screenshots from a commercial
game. No game, monster species, health-bar detection, tracking, object coordinates,
moving-target click accuracy or unattended combat has been certified by these tests.

The fast profile reduces the region's long edge to 256 pixels and uses at most 64
image tokens. JPEG encoding and downsampling can remove tiny details. Use the
existing **Color/Image/Agent Detect** tools for precise taught references and pixels,
and **Text/OCR/Math** for numbers. AI recognition complements those tools.

## Maths, result variables and clicking an answer

The visual yes/no model is **not a general mathematics solver**, OCR replacement or
numeric extractor. Use the deterministic **OCR + Math** workflow for visible, supported
arithmetic expressions. Word problems, handwriting and complex formulae need their
own validation; do not send unverified AI output into an action.

1. Crop the expression with the Math block's OCR region; choose its expression-reading mode.
2. Store a successfully evaluated result in an output variable. If reading/evaluation
   fails, take an error/retry path; do not treat a fallback zero as a successful answer.
3. For an integer answer, format it as an integer string (for example, `42` instead of
   `42.0`). Focus the intended editable field, then use **System → Input text** with
   a variable binding, or the app's explicit paste workflow.
4. If the answer is already a visible choice, use a **Text** block with that result
   string, narrow its search region to the answer choices, and click its actual match.
   Never invent an answer's screen coordinates from this visual model.

The release evidence distinguishes model failures from the separately exercised
OCR/arithmetic/variable/input pipeline. Importing this descriptor alone does not
automatically add or configure a mathematics workflow.

On the physical Samsung, the separate companion check passed: **platform screenshot
of `12 + 30` → production OCR → native Lua `Num.evalOcrMath` → variable `42` → real
focused input and paste → OCR locates visible `42` → real accessibility tap activates
that answer choice**. A genuine empty-hint-field paste defect was found and narrowly
fixed in the prepared app build. This is a controlled, high-contrast owned screen,
not word-problem, handwriting or arbitrary-game acceptance. The screenshot source
in that check is Android UiAutomation; full MediaProjection/user-macro acceptance
is not claimed by this component test.

## Capture, storage and speed

Each execution analyzes **one fresh frame of the selected region**. It does not
stream video or watch continuously while your True/False branch is running. Put the
block in a bounded macro loop when you need repeated observations.

JPEG/Base64/bitmap/RGB data stays in memory; this engine writes **no screenshot
history**. Only the last normalized image/visual embedding may be retained in RAM.
Exactly identical pixels can reuse that embedding; changed pixels replace it.
Every question gets fresh language-model state: **decisions and answers are never cached**.
Weights and visual allocations release after 30 idle seconds. Downloaded model data
and your small license-acceptance record intentionally persist in private,
backup-excluded storage.

Earlier 10-fixture speed checks observed Samsung warm calls of **0.91–1.76 seconds**
and LDPlayer warm calls of **0.39–1.29 seconds**. Samsung first initialization took
**3.66 seconds**. These are samples for small owned English fixtures with already
verified weights, **not** a universal 3-second SLA. Cold integrity checks, model
loading, multiple regions, long prompts, thermal throttling and other devices can
take longer. 24-hour endurance and broad OEM/game accuracy remain unverified.

## Lua plugin API

```lua
Snap.screenRefresh()
local frame = Capture.regionToBase64(inputs.region, "jpeg", 60)
local reply = AI.askVision(inputs.prompt, frame, "local:lfm25-vl450m", "image/jpeg", nil, 60000)
-- Selected model files and explicit license acceptance must already be present.
-- reply.ok=false is an error, NEVER a negative visual answer.
-- On success reply.text is JSON: decision, confidence=0, bounded raw answer.
-- Review/parse the structured decision before executing user-configured actions.
```

Use `local:smolvlm-256m` for the retained original model. Only the reviewed profiles
and exact SHA-256/length-matched pairs are supported. Unknown local providers fail
closed without cloud fallback. Model execution, stop/timeout ownership and capture
permissions remain enforced by the host app.

## Troubleshooting and updates

- Missing/corrupt weights: use the block's verified download/import controls; repair
  the pair rather than renaming an unrelated GGUF.
- LFM license not accepted: review the pinned license in the block settings first.
- Unknown answer: take the Unknown branch or ask a simpler yes/no question.
- No memory / unsupported architecture / timeout: take Error; do not continue as False.
- Small pixels/text: use dedicated deterministic detection/OCR instead of this fast profile.
- Updating the library does not rewrite existing macros. Explicitly add/replace a
  block when moving to a new package descriptor.

The descriptor/documentation are MIT-licensed under this repository's LICENSE.
The Android app, engine dependencies and each separately downloaded model retain
their own licenses. Package author/source strings and SHA-256 checksums are public
metadata, not a cryptographic publisher signature.

[Plugin library](https://macrohandler.com/plugins)
· [Visual Decision block reference](https://macrohandler.com/docs/visual-guide/mh_visual_decision)
· [LFM model license](https://huggingface.co/LiquidAI/LFM2.5-VL-450M-GGUF/blob/1abed04b6fe71314d8c446a1371c03d7c332266d/LICENSE)
