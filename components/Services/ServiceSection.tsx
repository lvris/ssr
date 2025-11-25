import { services } from "@/mocks/Services/data";

const ServiceSection = () => {
  return (
    <div className="flex-1 bg-amber-900 p-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-xl uppercase tracking-wider text-amber-200 mb-6">
        Shop by Category
      </h2>
      <div className="flex flex-col gap-3">
        {services.map(({ id, icon, title }) => (
          <button
            key={id}
            className="btn btn-md bg-amber-800 hover:bg-amber-700 border-amber-700 text-amber-100 gap-3 text-lg"
          >
            <span className="text-2xl">{icon}</span>
            <span className="capitalize">{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
