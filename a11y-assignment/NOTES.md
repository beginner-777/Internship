# Accessibility (a11y) Notes & Comparison

## Hand-Coded vs. shadcn/ui Implementation

### 1. Focus Management & Portals
- **Hand-Coded:** We manually tracked focus states, trapped keyboard navigation inside modals using event listeners, and relied on regular DOM rendering.
- **shadcn/ui:** Uses Radix UI / Base UI primitives under the hood, which automatically mount components to a global portal (`document.body`) to prevent stacking context or clipping issues, and handles advanced focus restoration upon closing.

### 2. ARIA Attributes & Keyboard Navigation
- **Hand-Coded:** Explicitly added ARIA attributes (`aria-expanded`, `aria-controls`, `role="tablist"`, etc.) and event handlers for `ArrowLeft`/`ArrowRight` keys.
- **shadcn/ui:** Fully automates W3C compliance out-of-the-box, ensuring robust screen reader compatibility, type-ahead search in lists, and seamless keyboard roving.

### 3. Styling & Customization
- **Hand-Coded:** Combined vanilla Tailwind utility classes directly inside component files.
- **shadcn/ui:** Employs `class-variance-authority` (CVA) and `clsx`/`tailwind-merge` to handle compound variants and clean class name merging dynamically.