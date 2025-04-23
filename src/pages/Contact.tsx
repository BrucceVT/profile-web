const Contact: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Contacto</h2>
        <p className="text-gray-700 mb-4">
          ¡Contáctame para colaboraciones o consultas!
        </p>
        <div className="space-y-4 max-w-md">
          <p>
            Email:{" "}
            <a
              href="mailto:john.doe@example.com"
              className="text-blue-600 hover:underline"
            >
              john.doe@example.com
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a href="#" className="text-blue-600 hover:underline">
              linkedin.com/in/johndoe
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a href="#" className="text-blue-600 hover:underline">
              github.com/johndoe
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
