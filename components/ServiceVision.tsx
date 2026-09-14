import type { CaseContentBlock } from "@/lib/projects";
import { RichText } from "./CaseStudyBlocks";
import styles from "./ServiceVision.module.css";

type Props = Extract<CaseContentBlock, { kind: "serviceVision" }>;

export function ServiceVision({ current, ambition, foundations, takeaway }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.path}>
        <div className={styles.current}>
          <p className={styles.label}>Customer need</p>
          <h3>{current.title}</h3>
          <p className={styles.detail}>{current.body}</p>
        </div>
        <div className={styles.ambition}>
          <p className={styles.label}>Business opportunity</p>
          <h3>{ambition.title}</h3>
          <p className={styles.detail}><RichText text={ambition.body} /></p>
        </div>
      </div>
      <div className={styles.foundations}>
        <p className={styles.label}>What I need to test next</p>
        <p className={styles.takeaway}>{takeaway}</p>
        <dl className={styles.requirements}>
          {foundations.map(item => (
            <div className={styles.requirement} key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
