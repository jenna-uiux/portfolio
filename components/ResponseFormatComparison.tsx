"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { CaseContentBlock } from "@/lib/projects";
import styles from "./ResponseFormatComparison.module.css";

type Props = Extract<CaseContentBlock, { kind: "responseFormatComparison" }>;

export function ResponseFormatComparison({ reasoning, options, selectedNumber, caption }: Props) {
  const id = useId();
  const [active, setActive] = useState(() => Math.max(0, options.findIndex(option => option.number === selectedNumber)));
  const option = options[active];

  function select(index: number, focus = false) {
    setActive(index);
    if (focus) document.getElementById(`${id}-tab-${index}`)?.focus();
  }

  return (
    <div className={styles.root}>
      <div className={styles.reasoning}>
        {reasoning.map(item => (
          <div key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div className={styles.comparison}>
        <div className={styles.preview} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}>
          <Image src={option.image.src} alt={option.image.description} width={915} height={626} sizes="(min-width: 768px) 45vw, 100vw" className={styles.image} />
        </div>
        <div className={styles.options} role="tablist" aria-label="Compare response formats" aria-orientation="vertical">
          {options.map((item, index) => (
            <button
              key={item.number}
              id={`${id}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls={`${id}-panel`}
              tabIndex={active === index ? 0 : -1}
              className={styles.option}
              onClick={() => select(index)}
              onKeyDown={event => {
                let next = index;
                if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % options.length;
                else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + options.length - 1) % options.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = options.length - 1;
                else return;
                event.preventDefault();
                select(next, true);
              }}
            >
              <span className={styles.meta}>Version {item.number}{item.number === selectedNumber && <span className={styles.badge}>Selected</span>}</span>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.body}>{item.body}</span>
            </button>
          ))}
        </div>
      </div>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
