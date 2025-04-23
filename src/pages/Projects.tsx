import Card from "@/components/common/Card";

const Projects: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Proyectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Proyecto Uno"
            description="Plataforma de comercio electrónico responsiva."
            link="#"
          />
          <Card
            title="Proyecto Dos"
            description="Aplicación de gestión de tareas con colaboración en tiempo real."
            link="#"
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;
