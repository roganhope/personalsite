export default function Button({
  href,
  target,
  rel,
  className = "",
  onClick,
  children,
}: {
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 rounded-full border border-ink bg-ink px-5 py-3.5 text-[.8rem] font-[850] tracking-[.06em] text-paper uppercase shadow-[4px_4px_0_var(--color-pink)] transition-[transform,background,color,box-shadow] duration-[180ms] hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-pink hover:text-on-accent hover:shadow-[1px_1px_0_var(--color-pink)] ${className}`}
    >
      {children}
    </a>
  );
}
