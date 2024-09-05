import { createBrowserRouter } from "react-router-dom";
import {
  AppLayout,
  LandingPage,
  Auth,
  RedirectLink,
  LinkTo,
  Dashboard,
} from "../index";
import RequireAuth from "../components/RequireAuth";

export const Routes = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkTo />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
    ],
  },
]);
