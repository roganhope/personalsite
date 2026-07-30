import Button from "./button";
import Wrap from "./wrap";
import HeroHeading from "./hero-heading";

export default function Hero() {
  return (
    <section className="border-t border-line">
      <Wrap className="grid min-h-[calc(100vh-84px)] place-items-center px-0 py-17.5 pb-25 text-center">
        <div>
          <HeroHeading />
          <p className="mx-auto mb-8 max-w-[540px] text-[1.08rem] text-[#3e3d3a]">
            I work in product management and engineering.
          </p>
          <Button href="/#contact">Let&apos;s make something ↘</Button>
        </div>
      </Wrap>
    </section>
  );
}
