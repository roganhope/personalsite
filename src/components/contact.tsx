import ContactForm from "./contact-form";
import MagicCard from "./magic-card";
import Section from "./section";
import Wrap from "./wrap";

export default function Contact() {
  return (
    <Section id="contact" className="bg-tint">
      <Wrap className="max-w-[560px]">
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-pink uppercase">Get in touch</p>
        <MagicCard className="p-8 shadow-[4px_4px_0_var(--color-pink)] max-[500px]:p-6">
          <ContactForm />
        </MagicCard>
      </Wrap>
    </Section>
  );
}
