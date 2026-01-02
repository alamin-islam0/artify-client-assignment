import React from "react";
import { Link } from "react-router-dom";
import { Palette, Camera, PenTool, ArrowRight } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Digital Art",
      description:
        "Explore the boundless creativity of digital illustrations and designs.",
      icon: <Palette size={40} className="text-secondary" />,
      bgImage:
        "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=1000",
      color: "bg-secondary/10",
      borderColor: "border-secondary/20",
    },
    {
      id: 2,
      name: "Photography",
      description:
        "Capture the world's beauty through the lens of talented photographers.",
      icon: <Camera size={40} className="text-primary" />,
      bgImage:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
      color: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      id: 3,
      name: "Traditional Art",
      description:
        "Appreciate the timeless elegance of sketches, paintings, and sculptures.",
      icon: <PenTool size={40} className="text-accent" />,
      bgImage:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000",
      color: "bg-accent/10",
      borderColor: "border-accent/20",
    },
  ];

  return (
    <section className="lg:pt-24 pt-16 md:pt-16 px-4 md:px-6  bg-base-200/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl text-[#111827] md:text-5xl font-bold font-montserrat text-white">
            Browse by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#111827]">
              Category
            </span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Discover artworks across diverse mediums and styles. Find the
            perfect piece that resonates with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              to={`/explore?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="group relative h-80 w-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div
                  className={`w-16 h-16 ${category.color} backdrop-blur-md border ${category.borderColor} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {category.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>

                <p className="text-gray-300 mb-6 line-clamp-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Explore Now</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
