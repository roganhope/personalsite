import type { Metadata } from "next";
import Button from "@/components/button";
import { GlyphMatrix } from "@/components/glyph-matrix";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Wrap from "@/components/wrap";

export const metadata: Metadata = {
  title: "This code has retired — Hope Rogan",
  // A destination for scanners, not for search.
  robots: { index: false },
};

// Where a retired /go link or printed QR code lands. Deliberately not a
// redirect: someone who scanned a code off a printed page deserves to read
// why it didn't take them anywhere rather than to be dropped on the homepage
// wondering whether they scanned it wrong.
export default function Retired() {
  return (
    <>
      <SiteHeader />
      <main className="relative z-10">
        <section className="relative min-h-[calc(100vh-84px)] overflow-hidden border-t border-line">
          <GlyphMatrix
            glyphs="▪▫·+■□"
            color="#ff3b8d"
            cellSize={16}
            mutationRate={0.05}
            fadeBottom={0.75}
            className="absolute inset-0"
          />
          <Wrap className="relative grid min-h-[calc(100vh-84px)] place-items-center px-0 py-17.5 pb-25 text-center">
            <div>
              <h1 className="mx-auto mb-5.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
                Retired
              </h1>
              <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] text-muted">
                That link has been retired — you&apos;ve probably scanned a
                code off something printed a while ago.
                <br />
                Everything it pointed to is still here.
              </p>
              <Button href="/">Go to the site</Button>
            </div>
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
