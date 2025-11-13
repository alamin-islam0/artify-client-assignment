import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, X } from "lucide-react";
import { Fade, Slide, Zoom } from "react-awesome-reveal";

export default function Footer() {
  return (
    <Fade triggerOnce>
      <footer className="bg-base-200 border-t border-base-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <Slide direction="up" triggerOnce>
            <div>
              <h2 className="text-3xl font-extrabold text-primary">Artify</h2>
              <p className="mt-2 text-sm opacity-70 leading-relaxed">
                Discover, share, and celebrate creative artworks from around the world.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-5">
                <Zoom cascade damping={0.15} triggerOnce>
                  <a href="#" className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-all duration-300">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-all duration-300">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-all duration-300">
                    <X size={18} />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-base-300 hover:bg-primary hover:text-white transition-all duration-300">
                    <Youtube size={18} />
                  </a>
                </Zoom>
              </div>
            </div>
          </Slide>

          {/* Quick Links */}
          <Slide direction="up" delay={150} triggerOnce>
            <div>
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/explore" className="hover:text-primary">Explore</Link></li>
                <li><Link to="/add-artwork" className="hover:text-primary">Add Artwork</Link></li>
                <li><Link to="/gallery" className="hover:text-primary">My Gallery</Link></li>
                <li><Link to="/favorites" className="hover:text-primary">My Favorites</Link></li>
              </ul>
            </div>
          </Slide>

          {/* Contact */}
          <Slide direction="up" delay={300} triggerOnce>
            <div>
              <h3 className="font-semibold text-lg mb-3">Contact Us</h3>

              <p className="flex items-center gap-3 text-sm mb-2">
                <Mail size={18} className="text-primary" /> support@artify.com
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-primary" /> +1 234 567 890
              </p>

              <p className="text-xs opacity-70 mt-4 leading-relaxed">
                Have suggestions or need help?  
                Our team is always ready to support you.
              </p>
            </div>
          </Slide>
        </div>

        {/* Bottom Section */}
        <Fade delay={200} triggerOnce>
          <div className="border-t border-base-300 py-4 text-center text-sm opacity-70">
            © {new Date().getFullYear()} <span className="font-semibold">Artify</span>. All Rights Reserved.
          </div>
        </Fade>
      </footer>
    </Fade>
  );
}