# Reveal.js Slide Plan (19 Slides)

This plan keeps the deck clean, minimal, and narrative-first with one core visual per slide where helpful.

## Design system

- Theme: white background, dark text, one primary accent (`#2063FF`).
- Typography: Inter or Segoe UI.
- Layout: left-aligned text, generous spacing, low visual noise.
- Motion: `fade` only, no heavy transitions.
- Rule: each slide has one message, one anchor visual pattern.

## Slide-by-slide plan

1. **Title**  
   - Visual: minimal title lockup with short subtitle.
   - Optional accent: thin horizontal rule or small left accent bar.

2. **The Reality**  
   - Visual: include `assets/current-way-diagram.svg`.
   - Emphasis: quote callout + bottom-line box.

3. **The Adoption Gap**  
   - Visual: two-column contrast (`mechanics learned` vs `workflow unchanged`).
   - Emphasis: large `!=` center glyph.

4. **Initial Ask**  
   - Visual: compact problem statement card stack (5 bullets).
   - Emphasis: this started from engineering pain.

5. **Enablement and Workshops**  
   - Visual: timeline segment card (`training -> prompts -> agents -> workshop`).
   - Emphasis: positive enablement motion.

6. **What Workshops Delivered**  
   - Visual: flow arrows (`notes -> requirements -> issues -> PRs`).
   - Emphasis: "art of the possible" + speaker note caveat.

7. **From Demo to Real Design**  
   - Visual: bridge metaphor graphic (workshop side -> implementation side).
   - Emphasis: real artifacts and constraints surfaced.

8. **Implementation Friction**  
   - Visual: signal card with quote + four reveal bullets.
   - Emphasis: clarity at high level, lost at execution level.

9. **Core Insight**  
   - Visual: "missing system" diagram with five missing elements.
   - Emphasis: Copilot requires persistent addressable context.

10. **Thinking System Installed**  
    - Visual: architecture sketch of spec-driven repo folders.
    - Emphasis: moved from conversation into system.

11. **What Changed (Before/After)**  
    - Visual: side-by-side before/after matrix.
    - Emphasis: ad hoc prompting -> structured execution.

12. **Current State**  
    - Visual: status dashboard style with 4 check-mark cards.
    - Emphasis: Copilot is now inside daily workflow.

13. **Business Impact**  
    - Visual: split value map (`customer impact` and `Microsoft impact`).
    - Emphasis: AI rooted in execution.

14. **Visual Timeline**  
    - Visual: full horizontal timeline with six milestones.
    - Emphasis: way-of-working shift over time.

15. **Adoption Model**  
    - Visual: stair-step model (`awareness -> exploration -> friction -> installation -> integration -> scale`).
    - Emphasis: realistic adoption path.

16. **Reusable CSA Framework**  
    - Visual: 5-stage loop graphic (`Externalize -> Structure -> Install -> Execute -> Repeat`).
    - Emphasis: repeatable method.

17. **Implications for CSA Work**  
    - Visual: stop/start split panel.
    - Emphasis: success metric is execution behavior change.

18. **Opportunity**  
    - Visual: engagement pattern pipeline with asset icons.
    - Emphasis: standardize as a Microsoft motion.

19. **Closing Insight**  
    - Visual: minimal closing statement slide with 4 supporting lines.
    - Emphasis: systemization drives durable Copilot adoption.

## Build workflow

1. Edit `data/slides.json`.
2. Run `npm run build` to regenerate `index.html`.
3. Run `npm run serve` for local preview.
4. Push to `main` to auto-deploy to GitHub Pages.

## Visual asset backlog (next)

- `assets/adoption-model.svg` (slide 15)
- `assets/framework-loop.svg` (slide 16)
- `assets/timeline.svg` (slide 14)
- `assets/before-after.svg` (slide 11)
