 "use client";
 
 import Link from "next/link";
 import { site } from "@/lib/site";
 import s from "./ContactDock.module.css";
 
 type Props = {
   /** Hide while an island scene is open (optional) */
   hidden?: boolean;
 };
 
 export function ContactDock({ hidden }: Props) {
   if (hidden) return null;
 
   const mailto = `mailto:${site.email}`;
 
   return (
     <div className={s.wrap} aria-label="Contact">
       <Link
         className={s.btn}
         href={site.links.linkedin}
         target="_blank"
         rel="noreferrer"
         aria-label="Open LinkedIn"
       >
         in
       </Link>
       <a className={s.btn} href={mailto} aria-label="Send email">
        <svg
          className={s.icon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4.75 7.25h14.5c.69 0 1.25.56 1.25 1.25v9.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-9.5c0-.69.56-1.25 1.25-1.25Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 8l6.5 5 6.5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
       </a>
     </div>
   );
 }

