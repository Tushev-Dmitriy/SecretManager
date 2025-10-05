import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Sidebar, Header } from "../components/business";
import styles from "./_baseLayout.module.css";

export const Route = createFileRoute("/_baseLayout")({
  component: LayoutComponent,
  beforeLoad: async () => {
    // throw redirect({ to: "/login" });
  },
});

function LayoutComponent() {
  return (
    <div className={styles.baseLayout}>
      <Sidebar />

      <div className={styles.page}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
