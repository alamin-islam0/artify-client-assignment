import { ShieldCheck, Globe, Users, Star } from "lucide-react";
import { Fade, Zoom } from "react-awesome-reveal";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Curated Excellence",
      description:
        "Every artwork is reviewed to ensure high quality and originality.",
      icon: <Star size={28} />,
    },
    {
      title: "Global Community",
      description:
        "Connect with artists and art lovers from over 100 countries.",
      icon: <Globe size={28} />,
    },
    {
      title: "Secure Platform",
      description:
        "Your data and intellectual property are protected with top-tier security.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Artist-First",
      description:
        "We prioritize artist visibility and provide tools to help you grow.",
      icon: <Users size={28} />,
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-base-200">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <Fade triggerOnce direction="left">
              <div className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold">
                Why Artify?
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                The Best Place to <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Showcase Art
                </span>
              </h2>
              <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                We built Artify to be more than just a gallery. It's a thriving
                ecosystem where creativity finds its audience. Join thousands of
                creators who trust us.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 text-left">
                    <div className="mt-1 p-2 bg-base-100 rounded-lg text-primary shadow-sm h-fit">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{feature.title}</h4>
                      <p className="text-sm opacity-70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Abstract Visual / Image */}
          <div className="lg:w-1/2 w-full">
            <Zoom triggerOnce>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl rotate-6 opacity-20 blur-lg"></div>
                <img
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop"
                  alt="Creative Process"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3] rotate-3 hover:rotate-0 transition-all duration-500 ease-out"
                />

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-base-100 p-4 rounded-xl shadow-xl items-center gap-3 animate-bounce hidden md:flex">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-base-300 border-2 border-base-100 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="avatar"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">10k+ Artists</p>
                    <p className="text-xs opacity-60">Joined recently</p>
                  </div>
                </div>
              </div>
            </Zoom>
          </div>
        </div>
      </div>
    </section>
  );
}
