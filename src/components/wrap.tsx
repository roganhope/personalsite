export default function Wrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-[min(100%-40px,1040px)] ${className}`}>{children}</div>;
}
