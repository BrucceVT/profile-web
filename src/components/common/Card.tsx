interface CardProps {
  title: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, description, link }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <a
        href={link}
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        Ver Proyecto
      </a>
    </div>
  );
};

export default Card;
