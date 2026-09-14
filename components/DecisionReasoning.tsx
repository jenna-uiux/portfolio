import type { CaseContentBlock } from "@/lib/projects";
import styles from "./DecisionReasoning.module.css";

type Props = Extract<CaseContentBlock, { kind: "decisionReasoning" }>;

export function DecisionReasoning({ title, items }: Props) {
  return (
    <div className={styles.root}>
      <h3 className="t-h3">{title}</h3>
      <div className={styles.columns}>
        {items.map((item) => (
          <div key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
