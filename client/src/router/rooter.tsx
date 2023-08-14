import { ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@app/pages/App";
import RouterErrorPage from "@app/router/RouterErrorPage";

export enum Routes {
  homepage = "/",
}

export const router = createBrowserRouter([
  {
    path: Routes.homepage,
    element: <App />,
    errorElement: <RouterErrorPage />,
  },
]);
