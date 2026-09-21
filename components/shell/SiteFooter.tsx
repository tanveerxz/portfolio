import Link from "next/link";
import { SITE } from "@/config/site";
import styles from "./Shell.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <Link href="/#top">Back to top</Link>
      </div>
    </footer>
  );
}
