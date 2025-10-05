import clsx from "clsx";
import styles from "./Badge.module.css";

interface BadgeProps {
  status: "approved" | "denied" | "pending";
}

const statusMap = {
  approved: "Доступен",
  denied: "Нет доступа",
  pending: "В ожидании",
};

export const Badge = ({ status }: BadgeProps) => {
  return (
    <div className={clsx(styles.badge, styles[status])}>
      {statusMap[status]}
    </div>
  );
};
