import Wrap from "./wrap";

export default function SiteHeader() {
  return (
    <header className="relative z-10">
      <Wrap>
        <nav className="flex items-center justify-between border-b border-line py-6.5">
          <a href="#top" className="text-[.9rem] font-extrabold tracking-[.07em] hover:text-pink">
            H.E.R.
          </a>
          <div className="flex gap-5.5 text-[.82rem] font-bold tracking-[.08em] uppercase max-[700px]:gap-3 max-[700px]:text-[.7rem]">
            <a href="#work" className="hover:text-pink">
              Work
            </a>
            <a href="#about" className="hover:text-pink">
              About
            </a>
            <a href="#contact" className="hover:text-pink">
              Say hey
            </a>
          </div>
        </nav>
      </Wrap>
    </header>
  );
}
