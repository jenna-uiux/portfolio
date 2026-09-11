"use client";

import { Trophy } from "lucide-react";
import styles from "./award.module.css";

export function AwardBadge({ label }: { label: string }) {
  return <div className={styles.award}>
    <Trophy size={15} strokeWidth={1.5} aria-hidden="true" />
    <span>{label}</span>
  </div>;
}
