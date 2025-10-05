import { DatabaseIcon, ExitIcon, HomeIcon } from "@secret-manager/ui";

import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img alt="SecretDoc" src="/secretLogo.svg" />
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="#" className={`${styles.navLink} ${styles.active}`}>
              <HomeIcon className={styles.icon} />
              <span>Главная</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              <DatabaseIcon className={styles.icon} />
              <span>База секретов</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              <ExitIcon className={styles.icon} />
              <span>Мои заявки</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
