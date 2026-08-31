# 06 — Layout shell

## `SectionWrapper`

Single place to tune site content width and gutters:

```tsx
// src/components/sections/SectionWrapper.tsx
"relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8"
```

| Breakpoint | Horizontal padding |
|------------|--------------------|
| default | 16px (`px-4`) |
| `sm`+ | 24px (`sm:px-6`) |
| `lg`+ (1024+) | 32px (`lg:px-8`) |

Usable content ≈ `min(viewport, 1440) − horizontal padding`.

### Why not `lg:px-0`?

At 1024–1440 viewports, zero padding makes content flush to the viewport edge even though `max-w` has not kicked in as outer margin. Always keep a gutter on this shell.

### Full-bleed exceptions

Heroes / media that must touch the edges should:

1. Keep the **outer** band full width, and  
2. Use `SectionWrapper` only for the text/CTA column, **or**  
3. Pass a one-off `className` override carefully (prefer not removing gutters site-wide).

## Skeleton parity

`PageSectionsSkeleton` mirrors the same `max-w-[1440px]` + gutters so loading layout matches live sections.

## Images

Default `SectionImage` `sizes` track the shell:

```
(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 720px
```

Update both wrapper max-width and image `sizes` together when changing the content rail.
