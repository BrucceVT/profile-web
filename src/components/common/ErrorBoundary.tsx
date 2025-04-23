const ErrorBoundary: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">¡Algo salió mal!</h2>
        <p className="text-gray-700 mb-4">
          Lo sentimos, ocurrió un error al cargar esta página.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Volver al Inicio
        </a>
      </div>
    </section>
  );
};

export default ErrorBoundary;
