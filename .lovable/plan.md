

# Implementation Plan: Headshot Styles, Gallery-to-Profile Photo, Known For Mobile Fix, Company Logo Library

## Issues & Features

### 1. Known For below CTA pushes headshot off-screen on mobile
In `renderClassic()` (line ~461), when `knownForPosition === 'hero_below_cta'`, the `KnownForStrip` renders inside the same flex column as the photo, pushing content down. On mobile (613px viewport), the hero has a fixed `minHeight` and the photo gets pushed above the visible area.

**Fix**: On mobile, when Known For is in `hero_below_cta` position, move it outside the photo/name flex container so it doesn't push the headshot up. Add `overflow-hidden` safety and ensure the hero container uses `min-h-fit` on mobile rather than a fixed height that clips.

### 2. Headshot style selector (new feature)
Currently `PhotoEl` hardcodes `rounded-full`. Users should choose from:
- **Circular** (current default)
- **Rounded square** (`rounded-xl`)
- **Square** (`rounded-none`)
- **Soft frame** (rounded with decorative border/shadow)
- **Hidden** (no photo, just name/initials)

**Implementation**:
- Add `headshot_style` column to `profiles` table (text, nullable, default `'circle'`)
- Add picker in Settings page (visual grid like hero layout picker)
- Update `PhotoEl` in `PortfolioHero.tsx` to read the style and apply appropriate border-radius/frame
- Update `ProfileEditor.tsx` photo preview to reflect chosen style

### 3. Gallery → Profile photo cross-link
When uploading to Gallery Manager, add a "Set as Profile Photo" button on each gallery image (hover overlay). Clicking it updates `profiles.profile_photo_url` to that image's URL.

### 4. Company logo library with graphical picker
Expand the Client Manager to include a "Browse Library" modal showing a visual grid of logos from the existing `COMPANY_DOMAINS` list (~200+ companies). Users can:
- Click to add any logo instantly
- Search/filter the grid
- Upload custom logos (already supported)

Add default example logos to the demo data (`demoC