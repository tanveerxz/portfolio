import { OrbPoster } from "@/components/narrative/OrbPoster";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" data-act="settled" aria-labelledby="contact-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <h2 id="contact-heading" className={styles.heading}>Let’s talk.</h2>
          <a className={styles.email} href="mailto:hello@tanveersingh.dev">
            hello@tanveersingh.dev
          </a>
        </div>
        <div className={styles.orbSlot} data-orb-anchor aria-hidden="true">
          <OrbPoster state="settled" />
        </div>
      </div>
    </section>
  );
}
