const NotFound: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">404 - Página No Encontrada</h2>
        <p className="text-gray-700">
          Lo sentimos, la página que buscas no existe.
        </p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al Inicio
        </a>
      </div>
    </section>
  );
};

export default NotFound;
