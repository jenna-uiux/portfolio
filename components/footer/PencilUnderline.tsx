/**
 * Hand-drawn pencil underline that draws in on hover.
 *
 * Wrap text children, give the parent the `group` class so the hover state
 * propagates from the link. Uses a slightly wobbly cubic path so it reads
 * as pencil rather than a flat CSS underline. The draw-in animation is
 * driven by a CSS class defined in globals.css (`.pencil-underline-path`).
 */
export function PencilUnderline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 120 6"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[3px] left-0 h-[6px] w-full overflow-visible"
      >
        <path
          d="M1 3.4 C 18 1.2, 38 4.6, 60 2.8 S 102 4.4, 119 2.6"
          className="pencil-underline-path"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
