"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { Confetti } from "./confetti";

const fieldClassName =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-[.9rem] text-ink outline-none transition-colors duration-150 focus:border-pink";

const labelClassName = "mb-1.5 block text-left text-[.7rem] font-[850] tracking-[.08em] text-muted uppercase";

/** Shares the contact form's Formspree inbox; the hidden `type` field labels submissions as reviews. */
export default function ReviewForm() {
  const [state, handleSubmit] = useForm("mqerjgvp");
  const submittedName = useRef("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    submittedName.current = String(new FormData(event.currentTarget).get("name") ?? "");
    handleSubmit(event);
  };

  useEffect(() => {
    if (state.succeeded) posthog.capture("review_form_submitted", { name: submittedName.current });
  }, [state.succeeded]);

  if (state.succeeded) {
    return (
      <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden text-center">
        <Confetti className="absolute inset-0 h-full w-full" />
        <p className="relative z-10 m-0 text-[1rem] text-ink">
          Thank you — I read every one. Your words might end up right here.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-left">
      <input type="hidden" name="type" value="review" />
      <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
        <div>
          <label htmlFor="review-name" className={labelClassName}>
            Name
          </label>
          <input type="text" id="review-name" name="name" required className={fieldClassName} />
          <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1 text-[.75rem] text-pink" />
        </div>
        <div>
          <label htmlFor="review-relationship" className={labelClassName}>
            How we worked together
          </label>
          <input
            type="text"
            id="review-relationship"
            name="relationship"
            placeholder="e.g. Teammate at Jade"
            className={fieldClassName}
          />
        </div>
      </div>
      <div>
        <label htmlFor="review-message" className={labelClassName}>
          Your review
        </label>
        <textarea id="review-message" name="message" required rows={4} className={`${fieldClassName} resize-none`} />
        <ValidationError
          prefix="Review"
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
        {state.submitting ? "Sending…" : "Send review"}
      </button>
    </form>
  );
}
