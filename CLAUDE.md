# Development Guidelines
- Tech Stack: HTML, CSS, JavaScript, React
- Build Commands: None
### Project Rules learned from Settings Form Assignment:
1. **Separation of Concerns:** Always keep validation helpers as pure utility functions separate from component UI files. This keeps logic isolated and 100% unit-testable.
2. **User Experience First:** Trigger form error validations exclusively on `onBlur` (input focus loss) events, rather than distracting users with errors while they type.
3. **Semantic Accessibility (a11y):** Every input element must contain matching `<label>` elements and dynamic screen-reader descriptors like `aria-invalid` and `aria-describedby`.