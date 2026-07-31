import Image from "next/image";
import { cn } from "@/lib/utils";
import { SpinningText } from "./magicui/spinning-text";

export default function HeroPortrait({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-56 w-56", className)}>
      <div className="absolute inset-0">
        <SpinningText
          radius={11}
          duration={18}
          className="h-full w-full text-[.72rem] font-[850] tracking-[.1em] text-muted uppercase"
        >
          Product • Engineering • AI •
        </SpinningText>
      </div>
      <div className="absolute inset-0 m-auto h-28 w-28 overflow-hidden rounded-full border border-line">
        <Image src="/hope-hero-bw.webp" alt="Hope smiling" fill sizes="112px" className="object-cover" />
      </div>
    </div>
  );
}
