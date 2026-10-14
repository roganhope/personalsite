import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/admin-nav";
import TrafficStats from "@/components/admin/traffic-stats";
import Wrap from "@/components/wrap";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Usage analytics — Hope Rogan",
  robots: { index: false },
};

// Gates itself rather than trusting src/proxy.ts; the login form lives on
// /secret/admin, so that's where a signed-out visitor goes.
export default async function UsagePage() {
  const cookieStore = await cookies();
  if (!verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect("/secret/admin");
  }

  return (
    <main className="relative z-10">
      <section className="border-t border-line px-0 py-[75px] text-center">
        <Wrap>
          <AdminNav active="usage" />
          <h1 className="mb-10 text-[clamp(1.75rem,4vw,2.5rem)] leading-[.98] font-bold tracking-[-.05em]">
            Usage analytics
          </h1>
          <div className="flex flex-col gap-14">
            <TrafficStats />
          </div>
        </Wrap>
      </section>
    </main>
  );
}
