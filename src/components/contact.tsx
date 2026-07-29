import Button from "./button";
import Section from "./section";
import Wrap from "./wrap";
import { EMAIL } from "@/lib/content";

export default function Contact() {
  return (
    <Section id="contact" className="bg-white/30">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-pink uppercase">Get in touch</p>
        <h2 className="mx-auto mb-5.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
          Say hello.
        </h2>
        <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] text-muted">
          I&apos;m always happy to hear from thoughtful people with an idea to share.
        </p>
        <Button href={`mailto:${EMAIL}`}>{EMAIL} ↗</Button>
      </Wrap>
    </Section>
  );
}
