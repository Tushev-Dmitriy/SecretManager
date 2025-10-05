import { RouterProvider } from "@tanstack/react-router";

import { router } from "./configs";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
