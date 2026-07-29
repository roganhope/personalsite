import Button from "./button";
import Wrap from "./wrap";

export default function Hero() {
  return (
    <section className="border-t border-line">
      <Wrap className="grid min-h-[calc(100vh-84px)] place-items-center px-0 py-17.5 pb-25 text-center">
        <div>
          <h1 className="mx-auto my-5.5 max-w-[900px] text-[clamp(3.25rem,10vw,7.8rem)] leading-[.91] font-bold tracking-[-.085em]">
            Hi, I&apos;m{" "}
            <span className="relative z-0 inline-block after:absolute after:-z-10 after:right-[4%] after:bottom-[.05em] after:left-[4%] after:h-[.14em] after:rotate-[-2deg] after:bg-pink after:content-['']">
              Hope.
            </span>
          </h1>
          <p className="my-0 mt-[-8px] mb-7 text-[clamp(.86rem,1.5vw,1rem)] font-bold tracking-[.13em] text-muted uppercase">
            Hope Elizabeth Rogan
          </p>
          <p className="mx-auto mb-8 max-w-[540px] text-[1.08rem] text-[#3e3d3a]">
            I work in product management and engineering.
          </p>
          <Button href="/#contact">Let&apos;s make something ↘</Button>
        </div>
      </Wrap>
    </section>
  );
}
