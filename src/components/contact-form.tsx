"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { Confetti } from "./confetti";

const fieldClassName =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-[.9rem] text-ink outline-none transition-colors duration-150 focus:border-pink";

const labelClassName = "mb-1.5 block text-left text-[.7rem] font-[850] tracking-[.08em] text-muted uppercase";

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mqerjgvp");
  const formRef = useRef<HTMLFormElement>(null);
  const [formHeight, setFormHeight] = useState<number>();

  useLayoutEffect(() => {
    if (formRef.current) setFormHeight(formRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    if (state.succeeded) posthog.capture("contact_form_submitted");
  }, [state.succeeded]);

  if (state.succeeded) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden text-center"
        style={{ minHeight: formHeight }}
      >
        <Confetti className="absolute inset-0 h-full w-full" />
        <p className="relative z-10 m-0 text-[1rem] text-ink">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mx-auto flex max-w-[480px] flex-col gap-5 text-left">
      <div>
        <label htmlFor="name" className={labelClassName}>
          Name
        </label>
        <input type="text" id="name" name="name" required className={fieldClassName} />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1 text-[.75rem] text-pink" />
      </div>
      <div>
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <input type="email" id="email" name="email" required className={fieldClassName} />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="mt-1 text-[.75rem] text-pink"
        />
      </div>
      <div>
        <label htmlFor="message" className={labelClassName}>
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={`${fieldClassName} resize-none`} />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1 text-[.75rem] text-pink"
        />
      </div>
      <button
        type="submit"
        disabled={state.submitting}
        className="inline-flex items-center justify-center gap-2.5 self-end rounded-full border border-ink bg-ink px-5 py-3.5 text-[.8rem] font-[850] tracking-[.06em] text-white uppercase shadow-[4px_4px_0_var(--color-pink)] transition-[transform,background,color,box-shadow] duration-[180ms] hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-pink hover:text-ink hover:shadow-[1px_1px_0_var(--color-pink)] disabled:pointer-events-none disabled:opacity-60"
      >
        {state.submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
