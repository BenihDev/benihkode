## 2025-03-20 - Added Global Focus Visible Styles
**Learning:** The application lacked any visible focus indicators (`:focus-visible`), which makes keyboard navigation (using Tab) incredibly difficult for accessibility users. Adding a simple outline with existing CSS variables (`var(--accent)`) significantly improves this.
**Action:** When working on new components or reviewing existing ones, always ensure they have a clear `:focus-visible` state or inherit a global one so keyboard users can navigate confidently.
