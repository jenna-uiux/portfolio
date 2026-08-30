# Fini case study — media drop folder

Drop image or video files into the matching subfolder using the **exact filename** below. The page picks them up automatically. Until a file exists, the slot renders a clean placeholder showing the expected path.

Supported types
- Images: `.jpg`, `.png`, `.webp` (use `.jpg` for screenshots; quality is set to 100, no optimization)
- Videos: `.mp4`, `.webm` (controls + poster supported)

To change a filename, update the `src` in `lib/projects.ts` for the matching media item.

---

## Overview

| Slot | Drop file at |
| --- | --- |
| Demo video — readiness check, voice capture, generated task, Apple Watch next step | `overview/demo-full-flow.mp4` |

## Research

| Slot | Drop file at |
| --- | --- |
| Diary study artifact — template, energy logs, synthesis notes | `research/diary-study-artifact.jpg` |

## Systems Architecture

| Slot | Drop file at |
| --- | --- |
| Systems Architecture walkthrough (below intro copy) | `system-architecture/system-layer.mp4` |
| System process — HealthKit signals → Edge Functions → AI orchestration → planning output | `system-architecture/process-diagram.jpg` |

## Design & Build

| Slot | Drop file at |
| --- | --- |
| 01 — Task entry: navigation entry vs. center entry | `design-build/01-task-entry.jpg` |
| 02 — Voice-first task capture flow | `design-build/02-voice-flow.jpg` |
| 03 — HealthKit signals → readiness states | `design-build/03-readiness-mapping.jpg` |
| 04 — Readiness state cards (In Flow / Light / Recovery) | `design-build/04-readiness-states.jpg` |
| 05 — Stress hybrid signal correction loop | `design-build/05-correction-loop.jpg` |
| 06 — Elastic deadline behavior | `design-build/06-elastic-deadline.jpg` |
| Process collage — Figma iterations, Cursor implementation, SwiftUI screens, Edge Functions | `design-build/process-collage.jpg` |
| Prototype behavior demo | `design-build/prototype-demo.mp4` |

---

## Notes

- File extension matters. If you drop a `.png` into a slot wired for `.jpg`, change the path in `lib/projects.ts` accordingly (or rename the file).
- For videos, the page uses native HTML `<video controls>` so MP4 (H.264) plays everywhere. Add a poster image at the same path with `.poster.jpg` if you want a still frame before play.
- The fallback placeholder shows you the exact expected path, so you always know where a missing file should go.
