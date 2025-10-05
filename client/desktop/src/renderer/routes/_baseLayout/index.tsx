import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_baseLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Index</div>;
}
