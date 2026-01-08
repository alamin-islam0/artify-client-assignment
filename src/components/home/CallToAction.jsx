import { ArrowRight } from "lucide-react";
import { Zoom } from "react-awesome-reveal";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Zoom triggerOnce>
          <div className="bg-base-300 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border border-base-content/5">
            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Ready to Share Your{" "}
                <span className="text-primary">Creativity?</span>
              </h2>
              <p className="text-lg opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the fastest-growing community of artists and art lovers.
                Start building your portfolio, connecting with peers, and
                discovering endless inspiration today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-primary/50 transition-all duration-300"
                >
                  Join for Free
                </Link>
                <Link
                  to="/explore"
                  className="btn btn-outline btn-lg rounded-full px-8 hover:bg-base-content hover:text-base-100 transition-all duration-300 group"
                >
                  Explore Artworks{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </section>
  );
}
