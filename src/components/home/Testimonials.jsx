import { Quote } from "lucide-react";
import { Fade } from "react-awesome-reveal";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Elena Rodriguez",
      role: "Digital Artist",
      image: "https://i.pravatar.cc/150?img=1",
      quote:
        "Artify has completely transformed how I showcase my work. The community is incredibly supportive, and the platform is beautiful.",
    },
    {
      id: 2,
      name: "Michael Chang",
      role: "Art Collector",
      image: "https://i.pravatar.cc/150?img=11",
      quote:
        "I've found so many hidden gems here. The user experience is smooth, and I love the personalized recommendations.",
    },
    {
      id: 3,
      name: "Sarah Jenkins",
      role: "Illustrator",
      image: "https://i.pravatar.cc/150?img=5",
      quote:
        "Finally, a platform that puts artists first. The gallery features are top-notch and easy to use.",
    },
    {
      id: 4,
      name: "David Okonjo",
      role: "Photographer",
      image: "https://i.pravatar.cc/150?img=8",
      quote:
        "The exposure I've gotten from Artify is unmatched. It's the best portfolio showcase I have ever used.",
    },
  ];

  return (
    <section className="py-24 bg-base-200">
      <div className="max-w-6xl mx-auto px-6">
        <Fade triggerOnce>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              What Our Users Say
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
        </Fade>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="pb-10">
              {" "}
              {/* Added pb for shadow clipping */}
              <div className="bg-base-200 p-8 rounded-2xl h-full flex flex-col relative mt-6 mx-2 border border-base-300/50">
                <div className="absolute -top-6 left-8 bg-primary text-white p-3 rounded-xl shadow-lg">
                  <Quote size={24} fill="currentColor" />
                </div>

                <p className="mt-6 mb-6 text-base-content/80 italic leading-relaxed">
                  "{review.quote}"
                </p>

                <div className="mt-auto flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{review.name}</h4>
                    <p className="text-xs opacity-60 font-medium uppercase tracking-wide">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
