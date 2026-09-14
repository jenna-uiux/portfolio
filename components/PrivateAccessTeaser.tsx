import styles from "./PrivateAccessTeaser.module.css";

type Props = {
  email: string;
};

export function PrivateAccessTeaser({ email }: Props) {
  return (
    <figure id="private-access-teaser" className={styles.root}>
      <div className={styles.background} aria-hidden="true" />
      <figcaption className={styles.content}>
        <span className={styles.lock} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7.75 10V7.75a4.25 4.25 0 0 1 8.5 0V10" />
            <rect x="5.5" y="10" width="13" height="10" rx="2.5" />
            <path d="M12 14v2.5" />
          </svg>
        </span>
        <p className={styles.status}>Try Strawberry Matcha</p>
        <p className={styles.prompt}>
          Access is currently private. Get in touch to try it.
        </p>
        <a className={styles.cta} href={`mailto:${email}`}>Request access ↗</a>
      </figcaption>
    </figure>
  );
}
