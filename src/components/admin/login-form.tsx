"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/secret/admin/actions";
import {
  fieldClassName,
  labelClassName,
  submitClassName,
} from "./form-styles";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <form
      action={action}
      className="mx-auto flex max-w-[380px] flex-col gap-5 text-left"
    >
      <div>
        <label htmlFor="password" className={labelClassName}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoFocus
          className={fieldClassName}
        />
        {state.error && (
          <p className="mt-1 text-[.75rem] text-pink">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`${submitClassName} self-end`}
      >
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
