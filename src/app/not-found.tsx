import type { Metadata } from "next";
import Button from "@/components/button";
import { GlyphMatrix } from "@/components/glyph-matrix";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Wrap from "@/components/wrap";

export const metadata: Metadata = {
  title: "Page not found — Hope Elizabeth Rogan",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative z-10">
        <section className="relative min-h-[calc(100vh-84px)] overflow-hidden border-t border-line">
          <GlyphMatrix
            glyphs="0104·•+*/\<>="
            color="#ff3b8d"
            cellSize={16}
            mutationRate={0.05}
            fadeBottom={0.75}
            className="absolute inset-0"
          />
          <Wrap className="relative grid min-h-[calc(100vh-84px)] place-items-center px-0 py-17.5 pb-25 text-center">
            <div>
              <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">404</p>
              <h1 className="mx-auto mb-5.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
                This page took a wrong turn.
              </h1>
              <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] text-muted">
                Whatever you were looking for isn&apos;t here. Let&apos;s get you back on track.
              </p>
              <Button href="/">Take me home ↘</Button>
            </div>
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
