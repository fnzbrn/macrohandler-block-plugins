# Local visual AI: model selection and task outputs

Plugin package **1.2.0** requires the reviewed **1.0.52 multitask host build**.
An earlier build with the same version name does not prove it contains this API.
Use the host source commit recorded in the release manifest. The published 1.0.51
app is not compatible. The plugin descriptor and model weights remain separate
downloads; none of these weights are embedded in the APK or `.mhblock` file.

## Reviewed model profiles

| Selectable profile | Separate download | Minimum available RAM guard | Region / image budget | License |
| --- | ---: | ---: | --- | --- |
| SmolVLM-256M Q8 | 278,824,384 bytes | 384 MiB | 512 px / original encoder | Apache-2.0 |
| LFM2.5-VL-450M Q4 fast | 322,126,432 bytes | 384 MiB | 256 px / 64 image tokens | LFM Open License v1.0 |
| SmolVLM-500M Q8 | 545,590,272 bytes | 768 MiB | 512 px / original encoder | Apache-2.0 |
| Qwen3-VL-2B Q4_K_M | 1,552,463,168 bytes | 2,048 MiB | 256 px / 64 image tokens | Apache-2.0 |

The RAM guard refers to **currently available** memory, not the device's advertised
RAM capacity. It is a conservative admission check, not a guarantee against every
OEM memory condition. Larger models may be slower. All use the existing reviewed
CPU engine and official, revision-pinned model/projector pairs. Size and SHA-256
checks apply to both HTTPS download and offline import. Never mix projectors.
There is one admitted model request and one cached model per process, not four
concurrent resident models. Selecting a profile does not start inference or download.

Primary model sources:

- [SmolVLM-256M](https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct)
- [SmolVLM-500M official GGUF conversion](https://huggingface.co/ggml-org/SmolVLM-500M-Instruct-GGUF)
- [Qwen3-VL-2B official model](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct)
  and [official GGUF files](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct-GGUF)
- [LFM2.5-VL-450M model and license](https://huggingface.co/LiquidAI/LFM2.5-VL-450M-GGUF)
- [llama.cpp multimodal engine](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md)

LFM is open-weight under its own commercial eligibility conditions; do not call
it unrestricted or Apache-2.0. Its existing explicit license-consent control remains.
The new SmolVLM and Qwen profiles use Apache-2.0. Model-card claims are not device
acceptance results. Other models/fine-tunes/formats are not automatically compatible
merely because they are open-source or have a GGUF filename. Adding a reviewed
profile requires a matching engine architecture, pinned weights, license review,
memory bounds and actual model/device evidence. Arbitrary executable plugin engines
and unreviewed GGUF files are not enabled by this change.

## Block settings

Choose the model, then **Output mode**. The choice and output-token budget are
stored per block, including nested groups, project serialization and Logic mapping.
Existing blocks default to their original model and binary decision behavior.
Screen region, prompt-variable bindings and all four action branches are preserved.
The model selector and task settings use the workspace theme and all 14 UI languages.
This does not establish equal model understanding in 14 languages.

- **Decision:** ask a short yes/no question, such as `Is a monster visible?`.
  Only unambiguous yes/true and no/false outputs select True/False. Other prose
  remains Unknown. The existing 12-token generation policy is unchanged.
- **Number:** ask to calculate or extract a number from the region. A completed
  single finite decimal is normalized into the configured answer variable.
  Prose, units, multiple candidates, NaN/infinity and malformed numbers become
  Unknown with an empty answer. There is no evaluation of generated source code.
  Generation is constrained to a decimal (at most 32 integer and 16 fractional
  digits) or UNKNOWN. This prevents a long reasoning transcript from consuming
  the numeric budget; it does not prove the number is correct.
- **Text:** ask to read a visible message, classify an object, describe the region
  or draft a short reply. A completed nonempty answer enters the answer variable.
  Quotes, Unicode and line breaks cross the host boundary as plain data.

For Number/Text, **True means a usable completed output was produced**, not that
the answer is factually correct or the requested object is present. False retains
its yes/no meaning in Decision mode. Unknown means no usable output. Timeouts,
runtime failures and output truncation use Error and cannot paste a partial answer.
The response limit can be 16/32/64/128/256 tokens (default 64); a longer response
can take more time and may require a higher timeout. The complete request remains
bounded by the existing maximum 60-second timeout. No calibrated confidence or
click/target coordinates are synthesized; keep the confidence threshold at zero.

## Deterministic arithmetic companion

**Arithmetic · OCR** is an explicit fourth task, independent of the selected generative model. It reads one visible line of basic arithmetic using the existing Latin OCR and Math evaluator, then writes the result into the same answer variable. No VLM weights, model license opt-in or prompt reasoning are used in this task. The model download/selection controls are hidden while it is selected. It accepts a tightly cropped single expression, such as `6 * 7` or `12 + 30`; unsupported text, multiple lines/expressions, invalid syntax and nonfinite results become Unknown. OCR recognition can still be wrong. Word problems, handwriting, symbolic mathematics and arbitrary precision are not certified. This uses the existing evaluator's numeric semantics; it does not execute captured/generated code.

Generative Number mode is not a dependable maths solver: the recorded models returned wrong numbers or Unknown for `6 * 7`, including when the expression was provided in the prompt. Number grammar constrains format only. Use the explicit Arithmetic task for supported expressions and inspect the recognized region.

On the final preview APK, physical Samsung SM-A055F / Android 14 produced `42` from
the owned `6 * 7` image in 655 ms and `42` from `12 + 30` in 126 ms. Blank and division
by zero produced Unknown. These are four high-contrast controlled cases, not a general
OCR accuracy or end-to-end live-screen speed guarantee.

The same final APK also passed those four Arithmetic cases on LDPlayer/x86_64:
the two valid results took 157 ms and 26 ms. Qwen's owned message example produced
the requested short reply, but took 13.626 seconds; it is a heavier alternative,
not the fastest profile. Neither result establishes arbitrary message/game accuracy.

## Variables and subsequent actions

Set an answer variable, such as `vision_answer`. On True, bind a System input/paste
block to that variable, or use it as the search text of an existing Text/OCR block
that finds and clicks a visible answer. Review the value and use the relevant
field/selection protections. A generative arithmetic answer can be wrong even when
it parses as a number: use the deterministic OCR + Math pipeline for supported
arithmetic requiring deterministic evaluation.

The native Lua 5.4 and compatibility hosts share the optional arguments:

```lua
local image = Capture.regionToBase64(Region(20, 40, 320, 200), "jpeg", 60)
local result = AI.askVision("Calculate the expression shown.", image,
    "local:qwen3-vl2b", "image/jpeg", nil, 60000, "number", 32)
if result.ok and result.decision == "true" then
    vision_answer = result.answer -- Data only; not a mathematical correctness proof.
end
```

The first six API arguments and legacy yes/no defaults remain available. Explicit
unknown tasks, fractional/out-of-range token budgets and unreviewed model IDs fail
closed. No cloud credentials are read and no cloud fallback is attempted for local
providers. Model text is never treated as script, an Android command or a target box.

## Capture, performance and evidence

Each invocation analyzes one fresh region frame. It is not a permanent live camera
stream. Screenshots are not saved to disk by this path; only the latest bounded
normalized image features can remain in RAM and are released after 30 seconds of
inactivity. Changed images replace those features and every decision is evaluated
with a fresh language-model context. Models remain as intentional installed data.

Cold loading, file integrity verification, input size, response length, CPU load and
thermal/OEM behavior affect latency. There is no universal 1–3 second guarantee.
Fine OCR, exact single-pixel changes, arbitrary mathematics, real-game recognition,
object-coordinate detection and 24-hour unattended operation require their own
acceptance tests. See the scoped audit and expected/actual device observations;
successful model execution is separate from correct answers.

## Install the preview plugin

1. Read the [versioned release](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/local-vision-v1.2.0) and its host-build requirement.
2. Download `local_visual_decision.mhblock`, then use Add block -> Import -> Plugins in No-Code or Logic. Importing does not start a macro.
3. Select a reviewed profile and download/import its exact model/projector pair, or choose Arithmetic OCR, which needs no VLM weights. License consent remains explicit for LFM.
4. Set a tight region, short prompt (for model tasks), answer variable, zero confidence threshold and all four branches. In Arithmetic OCR the prompt does not change the calculation.
5. Test positive, negative, Unknown and Error cases on the intended device. Existing library copies/macros are not silently rewritten when the package updates.

A single block uses one selected model. Different blocks can select different models; this is not simultaneous model voting or a multi-model agent conversation.

## Download and inspect

[Download the 1.2.0 plugin](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/local-vision-v1.2.0/local_visual_decision.mhblock)
or [open the release, checksums and evidence](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/local-vision-v1.2.0).
Read the [sanitized expected/actual observations](../local-vision-multimodel-evidence.json).
The [historical 1.1 binary checks](local-visual-decision-v1.1.md) remain available; do not confuse their APK and task surface with this release.

Package descriptors and these guides are MIT-licensed under this repository's LICENSE.
The host application, engine dependencies and separately downloaded models retain their own licenses.
Checksums verify public file integrity, not a cryptographic publisher signature.
