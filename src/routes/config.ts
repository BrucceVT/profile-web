import { lazy } from "react";

import { RouteConfig } from "@/types";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Componentes cargados de forma diferida (lazy loading)
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Projects = lazy(() => import("@/pages/Projects"));

// Definición de las rutas
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
    errorComponent: ErrorBoundary,
  },
  {
    path: "/about",
    component: About,
    errorComponent: ErrorBoundary,
  },
  {
    path: "/projects",
    component: Projects,
    errorComponent: ErrorBoundary,
  },
  {
    path: "/contact",
    component: Contact,
    errorComponent: ErrorBoundary,
  },
  {
    path: "*",
    component: NotFound,
    errorComponent: ErrorBoundary,
  },
];
