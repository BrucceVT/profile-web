import { Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import { routes } from "./config";
import { RouteConfig } from "@/types";
import Loading from "@/components/common/Loading";
import RootLayout from "@/components/layout/RootLayout";

// Mapear rutas a objetos de React Router
const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loading />}>
        <RootLayout />
      </Suspense>
    ),
    children: routes.map((route: RouteConfig) => ({
      path: route.path,
      element: <route.component />,
      errorElement: route.errorComponent ? <route.errorComponent /> : undefined,
    })) as RouteObject[],
  },
]);

export default router;
