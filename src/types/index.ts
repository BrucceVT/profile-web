export interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
}

// Definición de tipo para las rutas
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  errorComponent?: React.ComponentType;
}
