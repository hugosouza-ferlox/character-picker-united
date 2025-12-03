# Character Picker

A web application for picking game characters, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Character card display with stats
- Character selection functionality
- Responsive design
- Modern UI with shadcn/ui components

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Characters

Edit `app/page.tsx` to add more characters to the `exampleCharacters` array. Each character needs:

- `id`: Unique identifier
- `name`: Character name
- `variant`: Optional variant name (e.g., "CLASSIC")
- `imageUrl`: URL to character image
- `stats`: Array of stat objects with `value`, `icon`, and `color`

## Stat Icons

Available icons:
- `arrow`: Upward arrow
- `lightning`: Lightning bolt
- `explosion`: Sparkles/explosion
- `leaf`: Leaf/wing icon

Available colors:
- `yellow`
- `red`
- `green`

