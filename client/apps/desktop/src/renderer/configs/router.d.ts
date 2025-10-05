import type { router } from "./router.config";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
