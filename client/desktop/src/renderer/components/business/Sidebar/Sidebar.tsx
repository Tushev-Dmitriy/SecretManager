import { Link } from "@tanstack/react-router";
import { DatabaseIcon, HomeIcon } from "../../ui";
import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/secretLogo.svg" alt="SecretLogo" />
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>
                <HomeIcon className={styles.icon} />
                <span>Главная</span>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/secrets" className={styles.navLink}>
                <DatabaseIcon className={styles.icon} />
                <span>База секретов</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};
