const Contact: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Contacto</h2>
        <p className="text-gray-400 mb-4">
          ¡Contáctame para colaboraciones o consultas!
        </p>
        <div className="space-y-4 max-w-md">
          <p>
            Email:{" "}
            <a
              href="mailto:bvillena2000@gmail.com"
              className="text-blue-600 hover:underline"
            >
              bvillena2000@gmail.com
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/BrucceVT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github.com/BrucceVT
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/bruccevt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              linkedin.com/in/bruccevt
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
