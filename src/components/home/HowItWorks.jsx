import {
  UserPlus,
  UploadCloud,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Fade, Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description:
        "Sign up in seconds and build your personalized artist or collector profile.",
      icon: <UserPlus size={32} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Upload or Discover",
      description:
        "Artists upload masterpieces; collectors discover unique gems worldwide.",
      icon: <UploadCloud size={32} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 3,
      title: "Connect & Inspire",
      description:
        "Engage with the community, favorite art, and support creators directly.",
      icon: <HeartHandshake size={32} />,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <Fade triggerOnce>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              How Artify <span className="text-primary">Works</span>
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              Whether you are an artist sharing your vision or an enthusiast
              seeking inspiration, getting started is effortless.
            </p>
          </div>
        </Fade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-base-300 to-transparent z-0 transform translate-y-4"></div>

          {steps.map((step, index) => (
            <Slide key={step.id} direction="up" delay={index * 150} triggerOnce>
              <div className="relative z-10 bg-base-100 p-8 rounded-2xl shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group h-full flex flex-col items-center">
                <div
                  className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-base-content/70 leading-relaxed mb-6 flex-grow">
                  {step.description}
                </p>
                <div className="w-8 h-8 rounded-full bg-base-200 text-base-content/50 font-bold flex items-center justify-center text-sm">
                  {step.id}
                </div>
              </div>
            </Slide>
          ))}
        </div>

        <Fade delay={600} triggerOnce>
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="btn btn-primary btn-lg rounded-full px-8 gap-2 shadow-lg shadow-primary/30"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
          </div>
        </Fade>
      </div>
    </section>
  );
}
