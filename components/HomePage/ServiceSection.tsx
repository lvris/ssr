import { services } from "@/mocks/Services/data";

const ServiceSection = () => {
  return (
    <div className="flex-1 bg-amber-900 p-6 flex flex-col items-center justify-center text-center">
      <h2 className="text-sm uppercase tracking-wider text-amber-200 mb-4">
        Shop by Category
      </h2>
      <div className="flex flex-col gap-2">
        {services.map(({ id, icon, title }) => (
          <button
            key={id}
            className="btn btn-sm bg-amber-800 hover:bg-amber-700 border-amber-700 text-amber-100 gap-2"
          >
            <span className="text-lg">{icon}</span>
            <span className="capitalize">{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
