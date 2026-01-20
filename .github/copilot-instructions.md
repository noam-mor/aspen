# ADI WEINTRAUB Portfolio - Coding Instructions

## Project Overview
This is a minimalist portfolio website for graphic designer Adi Weintraub. The project is a **single-page HTML/CSS website** showcasing design work with an emphasis on clean typography, elegant layout, and responsive design.

**Key characteristics:**
- Static HTML + CSS (no build tools, no JavaScript)
- Portfolio projects organized in numbered directories (`no_1/`, `no_2/`, etc.) with associated image assets
- Brutalist design aesthetic: minimal styling, geometric grids, strong typography
- Responsive mobile-first approach with breakpoint at 768px

## Project Structure

```
/
├── index.html          # Main portfolio page (single page)
├── images/             # Project assets directory
│   ├── aspen/          # Unused/reference folder
│   ├── no_1/ ... no_10/   # Project folders (numbered 01-08 in HTML)
│   └── no_5_6/, no_6a/ # Alternative/nested project variants
└── .github/
    └── copilot-instructions.md  # This file
```

**Critical Pattern:** Project HTML sections reference projects by number (01-08) but image folders don't have strict 1:1 mapping. Folder names use different conventions (`no_1/`, `no_2/`) than HTML numbering.

## Architecture & Design Decisions

### Layout System
- **Fixed header** with logo (left) and nav links (right): `position: fixed; z-index: 100`
- **Bio section**: Large typography (1.8rem), max-width 800px, emphasis on readability
- **Project grid rows**: CSS Grid with 5 columns on desktop
  ```css
  grid-template-columns: 0.5fr 2fr 1.5fr 1fr 0.5fr; /* Number | Title | Type | Year | Arrow */
  ```
  This specific ratio balances visual hierarchy (title gets 2fr) while maintaining alignment.

### Design Patterns
1. **Hover interactions**: Subtle background color change + arrow animation (transform: translateX(10px))
2. **Typography hierarchy**: Helvetica Neue for body, Times New Roman serif for quotes
3. **Minimal borders**: Only top/bottom borders on project rows, emphasizing content over decoration
4. **Responsive collapse**: Mobile view switches to 2-column grid (`title | arrow` over `meta`), hides number/year

### Color Palette
- Pure white background (#ffffff)
- Pure black text (#000000)
- Hover: Light gray (#f5f5f5)
- Meta text: Medium gray (#333, #666)

## Developer Workflows

### Adding New Projects
1. Add new `<a class="project-row">` block in HTML following existing structure (5 child spans)
2. Increment `p-number` (01, 02, etc.)
3. Create corresponding image folder in `images/no_X/` with project assets
4. No build step needed; changes are live immediately

### Editing Layout
- **Header dimensions**: Padding 2rem 3rem, max-width 1400px container
- **Spacing conventions**: Padding uses 3rem (desktop), 1.5rem (mobile)
- **Breakpoint**: 768px for mobile adjustments
- **Z-index stack**: header = 100 (only fixed element)

### Updating Styles
All CSS is **inline in `<style>` tag** (~200 lines). No external stylesheets. Changes don't require build/refresh (hot reload works locally).

## Key Conventions

### Naming
- HTML class names: PascalCase prefix + kebab-case suffix (`.p-number`, `.p-title`, `.p-meta`)
- Image folders: `no_X/` (zero-padded numbers not used; `no_1/` not `no_01/`)
- Project types: Standardized values used ("Editorial Design", "Brand Identity", "Web Design", "Installation", "Speculative Design")

### HTML Structure
- Project rows are **semantic links** (`<a class="project-row">`) not `<div>`, but `href="#"` is placeholder (navigation not yet implemented)
- Each row contains exactly 5 spans (number, title, type, year, arrow)
- Footer quote section uses semantic `<footer>` tag with `.quote` and `.quote-author` classes

### Mobile Responsiveness
- Uses CSS Grid `grid-template-areas` for reflow (not flexbox)
- Display properties (`display: none`) hide elements rather than alternative layouts
- Font sizes scale down proportionally (1.8rem → 1.4rem for bio)

## Integration Points

- **No external dependencies** (no npm, no CDN resources)
- **No build process** required
- **No JavaScript** currently (all interactivity is CSS)
- Local image assets only (images/ folder)

## Next Steps for Enhancement
- Link project rows to detail pages or modal galleries
- Add image preloading strategy for gallery performance
- Implement smooth scrolling to #info, #contact anchors (currently unused)
- Consider adding subtle animation on page load (fade-in)

