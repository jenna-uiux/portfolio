import { site } from "@/lib/site";
import { FooterNav } from "./FooterNav";

const MONO =
  "ui-monospace, 'SF Mono', 'SFMono-Regular', 'IBM Plex Mono', Menlo, monospace";

export function SketchbookFooter({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <footer
      className={
        dark
          ? "relative bg-black text-[#f5f5f5]"
          : "relative bg-[#fafafa] text-black"
      }
      aria-label="Site footer"
    >
      <div
        className={[
          "container-ultra pb-[clamp(2.75rem,5vw,4.25rem)] pt-[clamp(3.75rem,7vw,6rem)]",
          dark ? "border-t border-white/10" : "border-t border-black/[0.08]",
        ].join(" ")}
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="flex flex-col lg:col-span-7">
            <div
              className={
                dark
                  ? "grid size-[37px] place-items-center bg-[#f5f5f5] text-black"
                  : "grid size-[37px] place-items-center bg-black text-[#f5f5f5]"
              }
              aria-hidden
            >
              <span
                className="select-none text-[17.5px] font-semibold leading-none"
                style={{ fontFamily: MONO }}
              >
                &gt;J<span className="prompt-cursor">_</span>
              </span>
            </div>

            <p
              className={
                dark
                  ? "mt-6 max-w-[22em] text-[24px] font-normal leading-[1.4] tracking-[-0.01em] text-[#f5f5f5]"
                  : "mt-6 max-w-[22em] text-[24px] font-normal leading-[1.4] tracking-[-0.01em] text-black"
              }
            >
              I design digital products,
              <br />
              then build them for real.
            </p>
          </div>

          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <FooterNav dark={dark} />
          </div>
        </div>

        <div
          className={
            dark
              ? "mt-16 flex flex-col gap-2 text-[13px] font-normal leading-[1.4] text-[#f5f5f5]/45 sm:flex-row sm:items-end sm:justify-between lg:mt-24"
              : "mt-16 flex flex-col gap-2 text-[13px] font-normal leading-[1.4] text-[#6a6a6a] sm:flex-row sm:items-end sm:justify-between lg:mt-24"
          }
        >
          <p>{site.footer.copyright}</p>
          <p>
            &gt; built with Cursor + coffee
            <span className="prompt-cursor">_</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
