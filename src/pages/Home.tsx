import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Bienvenido a mi Portafolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Hola, soy Brucce Yul Villena Terreros, un desarrollador apasionado
              por crear aplicaciones web modernas y responsivas. Explora mis
              proyectos y contáctame para colaboraciones.
            </p>
            <Button asChild>
              <Link to="/projects">Ver Proyectos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Home;
