---
name: Institutional Community
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#574144'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#8a7174'
  outline-variant: '#debfc2'
  surface-tint: '#aa304f'
  primary: '#670024'
  on-primary: '#ffffff'
  primary-container: '#8a1538'
  on-primary-container: '#ff97a8'
  inverse-primary: '#ffb2bd'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e5'
  on-secondary-container: '#636467'
  tertiary: '#003921'
  on-tertiary: '#ffffff'
  tertiary-container: '#005232'
  on-tertiary-container: '#7fc49b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bd'
  on-primary-fixed: '#400013'
  on-primary-fixed-variant: '#8a1538'
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#abf2c6'
  tertiary-fixed-dim: '#90d5ab'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#005232'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built on the intersection of academic reliability and student vibrancy. It adopts a **Corporate/Modern** aesthetic with a **Social-First** layer, ensuring that while the platform feels official and sanctioned by the university, it remains approachable for daily social interaction.

The style emphasizes clarity and organization, utilizing a "Circle" motif as its core geometric identifier. This manifests through repetitive use of circular avatars, pill-shaped badges, and soft-cornered containers. The visual narrative should evoke a sense of belonging and organized energy, transforming dense extracurricular data into an engaging, discoverable experience.

## Colors

The palette is anchored by a deep institutional crimson, used strategically for primary actions, branding, and high-level navigation to maintain a connection to the university’s heritage. 

A high-contrast neutral scale provides a clean "canvas" feel, with light grays (`#F8F9FA` to `#E9ECEF`) used for surface backgrounds and dark charcoals for text to ensure AAA accessibility. Accent colors are reserved strictly for categorization (e.g., Sky Blue for Sports) to help students mentally map the diversity of campus groups. Functional colors for status badges use a standardized semantic set to indicate application or event status clearly.

## Typography

The design system utilizes **Plus Jakarta Sans** for its modern, friendly, and highly legible characteristics. The type scale is intentionally robust to handle complex information architectures, such as club directories and student profiles.

For dense data views, use `body-sm` for secondary descriptions and `label-md` for tags. `Display` and `Headline-lg` are reserved for hero sections and major landing pages. Line heights are kept generous to maintain readability during long browsing sessions. On mobile devices, headline sizes scale down to prevent excessive word-breaking while maintaining the bold weight.

## Layout & Spacing

The design system employs a **Fluid Grid** model. Desktop layouts utilize a 12-column grid with 24px gutters to accommodate dense information cards and side-navigation menus. 

- **Desktop (1024px+):** Content is centered within a 1280px max-width container with 48px margins.
- **Tablet (768px - 1023px):** Transition to an 8-column grid with 32px margins.
- **Mobile (Up to 767px):** 4-column grid with 16px margins. 

Vertical spacing follows a 4px baseline rhythm. Components are grouped using `stack` variables to maintain consistent relationships: 8px for related items (label + input), 16px for content blocks within cards, and 32px for section separation.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy. Surfaces are categorized as follows:

1.  **Level 0 (Background):** The primary page background (`#F8F9FA`).
2.  **Level 1 (Cards/Containers):** Pure white surfaces (`#FFFFFF`) with a subtle 1px border (`#E9ECEF`) and a low-opacity soft shadow (Blur: 12px, Y: 4px, Opacity: 4% Black).
3.  **Level 2 (Dropdowns/Modals):** Floating elements with a more pronounced shadow (Blur: 24px, Y: 8px, Opacity: 8% Black) to indicate interaction priority.

Avoid heavy black shadows. Instead, use shadows that feel "airy" to maintain the modern, approachable feel.

## Shapes

The "Circle" motif is the defining characteristic of the shape language. 
- **Standard Components:** Buttons, input fields, and cards use a `0.5rem` (8px) radius.
- **Large Components:** Hero sections and featured club cards use `rounded-lg` (1rem / 16px).
- **Identity Elements:** Avatars and category badges are always fully circular (pill-shaped) to reinforce the platform's brand name. 

Containers should feel soft but structured, avoiding sharp 90-degree angles entirely to maintain an "accessible and friendly" tone.

## Components

**Buttons**  
Primary buttons use the institutional crimson background with white text. Secondary buttons use a light gray ghost style with crimson text. All buttons have a minimum height of 44px for touch accessibility and feature the standard `rounded` corner.

**Cards (Club Discovery)**  
The primary unit of the interface. Cards feature a top-aligned cover image, a circular club avatar overlapping the image/content border, and pill-shaped category badges. Titles use `headline-sm` for clarity.

**Input Fields**  
Fields use a subtle 1px border and 12px horizontal padding. On focus, the border transitions to the primary crimson with a soft 2px outer glow.

**Chips & Status Badges**  
Used for activity status (e.g., "Recruiting," "Active"). These are always pill-shaped with high-contrast text against a light-tinted version of the functional colors (e.g., Light Green background for Success Green text).

**Lists**  
Directory listings use a "Circle" avatar on the left, followed by a title and a sub-label. Lists are separated by light 1px dividers or increased vertical padding to avoid visual clutter.