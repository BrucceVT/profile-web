import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "Proyecto 1",
      description:
        "Una aplicación web moderna construida con React y Tailwind CSS.",
      link: "#",
    },
    {
      id: 2,
      title: "Proyecto 2",
      description: "Un sistema de gestión desarrollado con TypeScript y Vite.",
      link: "#",
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Proyectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Más detalles sobre el proyecto aquí.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <a href={project.link}>Ver Proyecto</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
