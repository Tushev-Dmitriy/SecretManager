import type { ComponentProps } from "react";
import styles from "./Table.module.css";
import clsx from "clsx";

export const Table = ({ className, children }: ComponentProps<"table">) => {
  return (
    <div className={styles.tableContainer}>
      <table className={clsx(styles.table, className)}>{children}</table>
    </div>
  );
};
