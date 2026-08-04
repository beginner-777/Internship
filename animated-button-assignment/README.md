# Interactive Button Lifecycle & Motion Choreography

An interactive, accessible, and state-aware button component built as a frontend micro-interaction assignment. It demonstrates a complete lifecycle (`idle` → `hover/focus` → `loading` → `success/error` → `idle`) without abrupt UI snaps.

## 🚀 Features & States
1. **Idle / Hover / Focus:** Responsive micro-interactions with visible focus rings for keyboard accessibility.
2. **Loading:** Disables pointer events to prevent spam-clicking mid-transition, presenting a smooth spinner.
3. **Success:** Transitions into a positive affirmation state with automatic reversion back to idle.
4. **Error & Retry:** Triggers a directional shake animation and offers a direct retry path.

## ⏱️ Duration & Easing Rationale
* **Hover / Focus Transitions (`150ms - 200ms`, `ease-out`):** Kept extremely fast so the interface feels instantly responsive to user intent.
* **Width & State Morphs (`300ms`, `cubic-bezier(0.4, 0, 0.2, 1)`):** Uses custom deceleration curves so the eye can comfortably track container resizing without feeling sluggish or unnatural.
* **Error Shake Animation (`400ms`, `cubic-bezier(.36,.07,.19,.97)`):** A tight, high-frequency horizontal translation (`-6px` to `6px`) to clearly communicate rejection or failure.

## ♿ Accessibility (`prefers-reduced-motion`)
The component strictly honors system accessibility preferences. If a user has `prefers-reduced-motion: reduce` enabled on their device, heavy shaking and transitions are disabled, falling back to clean opacity shifts so feedback is never lost.

## 🛠️ Stack
* HTML5
* CSS3 (Transitions & Keyframe Animations)
* Vanilla JavaScript (State Machine Logic)