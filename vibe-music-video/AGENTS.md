# Music-video agent entrypoint

Read `skills/music-video/SKILL.md` for the task mode and the corresponding reference. This repository is an independent implementation of an illustrated music-driven MV workflow. It contains a real reproducible example, not the original `.motion` templates or reference videos.

## Starting point

- For reproduction, use `examples/biebole` without changing its accepted timings. Install declared dependencies, run `pnpm doctor`, render a short excerpt, inspect it, then render the full song.
- For a new topic, first obtain an actual sung track. Work in `projects/<slug>`. Read `docs/CREATING.md` and `docs/PROJECT_FORMAT.md`; adapt scenes, art, timestamps and sound design. The example's narrative has ten hand-authored scenes and is not a universal song interpreter.
- Use repository-relative paths and documented environment variables. Do not depend on another checkout, machine-specific cache, global font installation or saved login.
- Do not install dependencies into someone else's environment. Use this project's `.venv` and package lock. Never bundle local environments or credentials.

## Visual and motion requirements

- One main lyric region at the top, integrated with the scene. No duplicate lower karaoke strip. Keep short phrase changes and per-character hops synchronized to the supplied vocal timestamps.
- Leave room for the maximum jump, stroke and shadow. Do not clip glyphs or cover faces, dialogue or essential props.
- Use illustrated scenes and consistent characters. Include appropriate poses, entrances, gestures, pauses, turns, prop changes and transitions. A gentle pan over a still image is not a complete narrative animation.
- Base all animation on the provided frame time. Do not use wall-clock time, unseeded randomness, CSS autoplay or asynchronous timers to drive exported frames.
- Preserve layer ordering: the café clerk goes behind the counter; the painted foreground is restored afterward. Pajama poses use explicit alpha bounds and a common foot baseline.
- Distinguish ASR/beat estimates from actual vocal melody extraction. New generated art/music need not match existing pixels or tunes; rendering the bundled fixed assets should preserve the same composition.

## Completion evidence

- `pnpm test` and `.venv` Python `-m unittest discover -s tests` for code changes.
- `pnpm doctor`, keyframes or a short music excerpt after changes to assets/timings/scenes. Inspect actual intermediate frames, not only the opening card.
- Full render must pass decode and expected frame-count/duration checks. Play the output to the end when a browser/video tool is available. Check lyric hops, phrase switches, dialogue, scene transitions and final fade. If audio listening is unavailable, state that limit accurately.
- Give clickable locations for MP4, MP3s and `report.json`. A preview is labeled preview. A successful render alone does not prove artistic quality.
- Do not replace missing sung music with TTS or synth beeps and call the work complete. Do not crop out or remove required provider marks.

## Sharing

Read `THIRD_PARTY.md` before releasing source or media. Use `pnpm package` and inspect its manifest. Public publishing uses the destination and scope requested by the human; a local ZIP does not imply that GitHub has been updated. Do not upload private projects, conversations, browser data or unselected music candidates.
