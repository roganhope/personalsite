<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Regenerating the hero gif

`public/hero.gif` is a recording of the hero intro animation (heading typing
+ tagline fade-in only — no navbar, no button). To regenerate it:

1. Run `npm run dev` in the background.
2. Use Playwright (`npm install --no-save --no-package-lock playwright` if
   not already available) to load the page, remove the `<header>` and the
   button's wrapper div via `page.evaluate`, then capture a PNG frame
   sequence clipped to the hero content's bounding box at ~30fps for the
   duration of the animation (heading done + tagline fade, ~4.7s).
3. Encode the frames to a gif with ffmpeg using a two-pass palette
   (`palettegen` / `paletteuse`) for quality, scaled to ~800px wide.
4. Before saving over `public/hero.gif`, ask whether to delete the old gif
   or keep it and store the new one under a different filename.
