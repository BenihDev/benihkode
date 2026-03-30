# Homepage "View All" Links Design Spec

## Overview
This document specifies the design for adding "View All" functionality to the BenihKode landing page to ensure it scales cleanly as the content collections (Ideas, Projects, Journal) grow over time.

## Architecture & Layout Changes

1. **Homepage Content Caps**
   - The "Ideas" section will pull only the top 4 entries (sorted by `order`).
   - The "Portfolio" section will pull only the top 4 entries (sorted by `order`).
   - The "Journal" section will pull only the top 4-5 entries (sorted by `pubDate`).

2. **Inline Header Links**
   - Each section header (`h2.section-title`) will be updated to include an inline, stylish "View all [Collection] →" link. 
   - This link will be right-aligned or positioned directly beside the title text to maintain the sleek aesthetic, adhering to approach #1.

3. **New Collection Index Pages**
   - **`/ideas`**: A new Astro page (`src/pages/ideas/index.astro`) listing all product idea cards.
   - **`/projects`**: A new Astro page (`src/pages/projects/index.astro`) listing all shipped project portfolio cards.
   - Both pages will utilize the existing `BaseLayout` to ensure visual consistency with the rest of the application.

## Error Handling & Testing
   - Ensure the routing to the new subpages works flawlessly in the Astro build (`pnpm build`).
   - Unit tests are currently minimal, but manual visual verification of the flexbox/grid layout on smaller screens is required to ensure the inline header link doesn't break responsively.
