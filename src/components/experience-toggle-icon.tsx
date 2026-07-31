export default function ExperienceToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative h-5 w-5 transition-[color,transform] duration-[220ms] ease-in-out group-hover:text-pink before:absolute before:top-1/2 before:left-0 before:h-[1.5px] before:w-full before:-translate-y-1/2 before:bg-current before:content-[''] after:absolute after:top-1/2 after:left-0 after:h-[1.5px] after:w-full after:-translate-y-1/2 after:rotate-90 after:bg-current after:transition-[transform,opacity] after:duration-[280ms] after:ease-in-out after:content-[''] max-[700px]:absolute max-[700px]:top-1/2 max-[700px]:right-6 max-[700px]:-mt-2.5 ${
        isOpen ? "text-pink after:scale-x-0 after:opacity-0" : "group-hover:rotate-90"
      }`}
    />
  );
}
