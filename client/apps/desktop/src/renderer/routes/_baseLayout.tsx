import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Sidebar } from "../components";

export const Route = createFileRoute("/_baseLayout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="baseLayout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
