import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Fade, Slide, Zoom } from "react-awesome-reveal";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Message Sent Successfully!",
        text: "Thank you for reaching out. We will get back to you within 24 hours.",
        confirmButtonColor: "#3b82f6",
        background: "#fff",
        customClass: {
          popup: "rounded-3xl",
        },
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactCards = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      subInfo: "Mon-Fri from 8am to 5pm",
      color: "text-blue-500",
      bg: "bg-blue-50",
      delay: 0,
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      info: "hello@artify.com",
      subInfo: "We generally reply in 24h",
      color: "text-purple-500",
      bg: "bg-purple-50",
      delay: 100,
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit Us",
      info: "123 Art Street",
      subInfo: "Creative City, NY 10012",
      color: "text-pink-500",
      bg: "bg-pink-50",
      delay: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* 1. Immersive Hero Section with Parallax-like feel */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Art Studio"
          className="absolute inset-0 w-full h-full object-cover z-0 animate-scale-slow"
        />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <Fade direction="up" triggerOnce>
            <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wider mb-6">
              24/7 SUPPORT TEM
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg inter-font">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Touch
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed montserrat-font">
              We'd love to hear from you. Whether you have a question about
              features, pricing, or just want to say hi, our team is ready to
              answer all your questions.
            </p>
          </Fade>
        </div>
      </section>

      {/* 2. Floating Info Cards */}
      <section className="relative px-4 -mt-20 z-30 mb-20 container mx-auto">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {contactCards.map((card, idx) => (
            <Fade delay={card.delay} triggerOnce key={idx}>
              <div className="group bg-base-100 rounded-3xl p-8 shadow-xl border border-base-200 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${card.bg} ${card.color} group-hover:scale-110`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 inter-font group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="font-semibold text-lg mb-1">{card.info}</p>
                <p className="text-sm opacity-60 montserrat-font">
                  {card.subInfo}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* 3. Main Content Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto items-start">
          {/* Left Column: Form */}
          <Fade direction="left" triggerOnce className="w-full">
            <div className="bg-base-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-base-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[10rem] -z-0" />

              <div className="relative z-10 mb-8">
                <h2 className="text-3xl font-extrabold mb-2 inter-font">
                  Send us a Message
                </h2>
                <p className="opacity-60">
                  Fill out the form below and we'll reply soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="form-control">
                    <label
                      className={`label transition-all ${
                        focusedField === "name" ? "text-primary" : ""
                      }`}
                    >
                      <span className="label-text font-semibold">
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="input input-bordered w-full h-12 bg-base-200/50 hover:bg-base-200 focus:bg-base-100 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="form-control">
                    <label
                      className={`label transition-all ${
                        focusedField === "email" ? "text-primary" : ""
                      }`}
                    >
                      <span className="label-text font-semibold">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="input input-bordered w-full h-12 bg-base-200/50 hover:bg-base-200 focus:bg-base-100 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="form-control">
                  <label
                    className={`label transition-all ${
                      focusedField === "subject" ? "text-primary" : ""
                    }`}
                  >
                    <span className="label-text font-semibold">Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className="input input-bordered w-full h-12 bg-base-200/50 hover:bg-base-200 focus:bg-base-100 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl"
                    required
                  />
                </div>

                {/* Message Input */}
                <div className="form-control">
                  <label
                    className={`label transition-all ${
                      focusedField === "message" ? "text-primary" : ""
                    }`}
                  >
                    <span className="label-text font-semibold">
                      Your Message
                    </span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us everything..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="textarea textarea-bordered w-full h-40 bg-base-200/50 hover:bg-base-200 focus:bg-base-100 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl resize-none text-base leading-relaxed"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send size={20} className="animate-pulse" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </Fade>

          {/* Right Column: Additional Interactive Info */}
          <div className="space-y-12">
            <Fade direction="right" triggerOnce delay={200}>
              {/* FAQ / Info Accordion */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold inter-font flex items-center gap-2">
                  <Globe className="text-primary" /> Frequently Asked Questions
                </h3>
                <div className="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <input type="radio" name="my-accordion-3" defaultChecked />
                  <div className="collapse-title text-lg font-medium">
                    How quickly do you respond?
                  </div>
                  <div className="collapse-content">
                    <p className="opacity-70">
                      We try to answer all tickets within 24 hours on business
                      days, typically much faster.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-lg font-medium">
                    Do you offer custom art commissions?
                  </div>
                  <div className="collapse-content">
                    <p className="opacity-70">
                      Yes! Many of our artists accept commissions. You can
                      contact them directly through their profiles or ask us for
                      recommendations.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-lg font-medium">
                    Where is Artify located?
                  </div>
                  <div className="collapse-content">
                    <p className="opacity-70">
                      We are a digital-first platform with headquarters in
                      Creative City, New York. However, our community is global.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div>
                <h4 className="font-bold text-xl mb-6 mt-10">
                  Connect With Us
                </h4>
                <div className="flex gap-4">
                  {[
                    {
                      Icon: FaFacebook,
                      name: "Facebook",
                      color: "hover:bg-[#1877F2] hover:text-white",
                    },
                    {
                      Icon: FaTwitter,
                      name: "Twitter",
                      color: "hover:bg-[#1DA1F2] hover:text-white",
                    },
                    {
                      Icon: FaInstagram,
                      name: "Instagram",
                      color: "hover:bg-[#E4405F] hover:text-white",
                    },
                    {
                      Icon: FaLinkedin,
                      name: "LinkedIn",
                      color: "hover:bg-[#0A66C2] hover:text-white",
                    },
                    {
                      Icon: FaWhatsapp,
                      name: "WhatsApp",
                      color: "hover:bg-[#25D366] hover:text-white",
                    },
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className={`w-12 h-12 rounded-full bg-base-100 border border-base-300 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-lg ${item.color} group`}
                      aria-label={item.name}
                    >
                      <item.Icon className="transition-transform group-hover:rotate-12" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Interactive Map Card */}
              <div className="mt-10 bg-base-100 p-2 rounded-3xl border border-base-200 shadow-lg relative group overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm rounded-2xl">
                  <button className="btn btn-primary btn-outline text-white border-white hover:bg-white hover:text-primary hover:border-white gap-2">
                    Open in Google Maps <ArrowRight size={18} />
                  </button>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1651590872898!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: "1rem" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map Location"
                  className="grayscale group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* Decorative CSS for special animations */}
      <style>{`
        @keyframes scale-slow {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-scale-slow {
          animation: scale-slow 20s linear infinite alternate;
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
         @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 10px); }
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
