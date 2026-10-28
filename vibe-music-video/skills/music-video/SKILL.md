---
name: music-video
description: Make illustrated Chinese song MVs with consistent characters, narrative action, props and word-timed upper lyrics, or reproduce this repository's complete example. Use for music-video production and export; not ordinary subtitle transcription or generic slide shows.
---

# Illustrated song MV

The song leads the production. Write a relatable small story, obtain a real sung song, then build an animated storyboard around its performance. Lyrics, action, props and cuts share the audio clock. This project renders a deterministic Canvas scene through Remotion.

Resolve paths relative to this repository. Read root `AGENTS.md` before editing.

## Reproduce the example

Read root `README.md` for dependencies and commands. The example includes the original selected music, four painted PNG assets, two licensed fonts, accepted word times and action cues. Do not generate new music or download an ASR model merely to reproduce it.

Run `pnpm doctor`, then `pnpm preview --out outputs/check-<unique-name>`. Inspect the exported video and frame samples. Run `pnpm demo --out outputs/final-<unique-name>` and verify the result. Use a new output folder for each version. `pnpm serve --out <folder> --port <free-port>` provides range-capable video playback and frame stepping.

## Create a new song MV

Read [creation workflow](../../docs/CREATING.md) and [project format](../../docs/PROJECT_FORMAT.md). These are repository references, not instructions to use any particular provider account.

1. Choose one recognizable event and a concrete visual payoff. Write short singable Chinese phrases with a memorable repeated hook. Keep character identity, scenes and props coherent with the event.
2. Generate the actual song using an available authorized music service, or use supplied audio. The official MiniMax webpage is one option; do not assume new API access or free credits. Preserve source attribution and required marks. Use image generation capabilities available to the host agent, or supplied artwork; no plugin is assumed.
3. Create a project draft with `pnpm new`. Use actual sung audio to propose timestamps with `pnpm align` if needed. ASR proposals require review, especially homophones, repeated lyrics, long notes and missed syllables. Do not reuse demo timestamps for a new recording.
4. Write the storyboard and `scenes.ts`, generate/adapt art, set alpha regions, author prop motion and `sound-design.json`, then accept the reviewed timings and mark the project ready. Read the example code for usable implementations, not as ten compulsory scenes for every song.
5. Check keyframes and a music excerpt. Make the top lyric phrase jump character by character on its vocal onset. Keep one main lyric region and clear visual hierarchy. Once the scene and sound work, render the complete song and inspect the actual output.

## Final handoff

Return MP4, original song, edited pure-song MP3, mixed video-track MP3, and the verification record. When covers/publication materials are requested, use [handoff guidance](references/handoff.md). Do not label mixed sound as pure music. Keep preview, full render and automatic checks distinct from subjective viewing/listening.

For missing tools, browser libraries, fonts or memory failures, read [troubleshooting](../../docs/TROUBLESHOOTING.md). Preserve sources while fixing a render failure; never deliver a static placeholder to hide it.
