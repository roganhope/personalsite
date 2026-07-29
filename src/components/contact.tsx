import Button from "./button";
import Section from "./section";
import Wrap from "./wrap";
import { EMAIL } from "@/lib/content";

export default function Contact() {
  return (
    <Section id="contact" className="bg-white/30">
      <Wrap>
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-pink uppercase">Get in touch</p>
        <Button href={`mailto:${EMAIL}`}>{EMAIL} ↗</Button>
      </Wrap>
    </Section>
  );
}
