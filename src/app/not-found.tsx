import type { Metadata } from "next";
import CountdownHomeButton from "@/components/countdown-home-button";
import { GlyphMatrix } from "@/components/glyph-matrix";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Wrap from "@/components/wrap";

export const metadata: Metadata = {
  title: "Page not found — Hope Rogan",
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
              <h1 className="mx-auto mb-5.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
                404
              </h1>
              <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] text-muted">
                I don&apos;t even know how you managed to end up here.
                <br />
                Let&apos;s get you back home.
              </p>
              <CountdownHomeButton />
            </div>
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
