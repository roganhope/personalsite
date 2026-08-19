import type { Metadata } from "next";
import { cookies } from "next/headers";
import LinkGenerator from "@/components/admin/link-generator";
import LoginForm from "@/components/admin/login-form";
import RegisteredLinks from "@/components/admin/registered-links";
import Wrap from "@/components/wrap";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin — Hope Rogan",
  robots: { index: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <main className="relative z-10">
      <section className="border-t border-line px-0 py-[75px] text-center">
        <Wrap>
          <h1 className="mb-10 text-[clamp(1.75rem,4vw,2.5rem)] leading-[.98] font-bold tracking-[-.05em]">
            {authed ? "Link builder" : "Hello?"}
          </h1>
          {authed ? (
            <div className="flex flex-col gap-14">
              <LinkGenerator />
              <RegisteredLinks />
            </div>
          ) : (
            <LoginForm />
          )}
        </Wrap>
      </section>
    </main>
  );
}
