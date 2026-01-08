import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Mail,
  Phone,
  Send,
  MapPin,
} from "lucide-react";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import toast from "react-hot-toast";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing to our newsletter!");
    e.target.reset();
  };

  return (
    <Fade triggerOnce>
      <footer className="bg-base-200 border-t border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <Slide direction="up" triggerOnce>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-primary tracking-tight">
                  Artify
                </h2>
                <p className="mt-4 text-sm opacity-70 leading-relaxed max-w-xs">
                  A premier platform to discover, share, and celebrate creative
                  masterpieces from artists around the globe. Join our vibrant
                  community today.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3">
                <Zoom cascade damping={0.15} triggerOnce>
                  <a
                    href="https://www.facebook.com/Alamin.islam19.19/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300 text-base-content hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/alamin._.islam/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300 text-base-content hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://github.com/alamin-islam0"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300 text-base-content hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alaminislam2023/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-base-300 text-base-content hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </Zoom>
              </div>
            </div>
          </Slide>

          {/* Quick Links */}
          <Slide direction="up" delay={100} triggerOnce>
            <div>
              <h3 className="font-bold text-lg mb-6 text-base-content">
                Discovery
              </h3>
              <ul className="space-y-3 text-sm font-medium opacity-80">
                <li>
                  <Link
                    to="/"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explore"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    Explore Arts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </Slide>

          {/* User Area */}
          <Slide direction="up" delay={200} triggerOnce>
            <div>
              <h3 className="font-bold text-lg mb-6 text-base-content">
                For Artists
              </h3>
              <ul className="space-y-3 text-sm font-medium opacity-80">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/add-artwork"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    Submit Artwork
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/gallery"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    My Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/favorites"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    My Favorites
                  </Link>
                </li>
              </ul>
            </div>
          </Slide>

          {/* Newsletter & Contact */}
          <Slide direction="up" delay={300} triggerOnce>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-6 text-base-content">
                  Stay in the Loop
                </h3>
                <p className="text-sm opacity-70 mb-4">
                  Subscribe to receive updates on new features and top artists.
                </p>
                <form onSubmit={handleSubscribe} className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full input input-bordered pr-12 text-sm focus:outline-none focus:border-primary bg-base-100"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors shadow-md"
                    aria-label="Subscribe"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

              <div className="space-y-3 pt-2">
                <p className="flex items-start gap-3 text-sm opacity-80">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <span>123 Art Avenue, Design District, NY 10012</span>
                </p>
                <p className="flex items-center gap-3 text-sm opacity-80">
                  <Mail size={18} className="text-primary shrink-0" />
                  <a
                    href="mailto:support@artify.com"
                    className="hover:text-primary transition-colors"
                  >
                    support@artify.com
                  </a>
                </p>
                <p className="flex items-center gap-3 text-sm opacity-80">
                  <Phone size={18} className="text-primary shrink-0" />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-primary transition-colors"
                  >
                    +1 234 567 890
                  </a>
                </p>
              </div>
            </div>
          </Slide>
        </div>

        {/* Bottom Section */}
        <Fade delay={200} triggerOnce>
          <div className="border-t border-base-300">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
              <p>
                &copy; {new Date().getFullYear()}{" "}
                <span className="font-bold text-base-content opacity-100">
                  Artify
                </span>
                . All Rights Reserved.
              </p>
              <div className="flex gap-6">
                <Link to="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </Fade>
      </footer>
    </Fade>
  );
}
