import { BellIcon } from "../../ui";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <button className={styles.bellButton}>
        <BellIcon />
      </button>
      <p>Олег Смирнов</p>
      <img src="/userLogo.png" alt="userLogo" />
    </header>
  );
};
