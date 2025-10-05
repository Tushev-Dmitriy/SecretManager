import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/renderer/components";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container form-page">
      <LoginForm />
    </div>
  );
}
