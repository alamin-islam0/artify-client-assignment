import { Fade } from "react-awesome-reveal";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function Statistics() {
  const axiosPublic = useAxiosPublic();

  const {
    data: statData = {
      totalArtworks: 0,
      totalArtists: 0,
      totalCategories: 0,
      totalLikes: 0,
    },
  } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [artsRes, likesRes] = await Promise.all([
        axiosPublic.get("/arts?limit=10000&page=1"),
        axiosPublic
          .get("/likes/total")
          .catch(() => ({ data: { totalLikes: 0 } })),
      ]);

      // Extract styles/categories and artists from specific response structure
      let artsArray = [];
      const artsJson = artsRes.data;

      if (Array.isArray(artsJson)) {
        artsArray = artsJson;
      } else if (Array.isArray(artsJson.data)) {
        artsArray = artsJson.data;
      } else if (Array.isArray(artsJson.results)) {
        artsArray = artsJson.results;
      }

      // Calculate Unique Artists
      const uniqueArtists = new Set(
        artsArray
          .map((a) => a.userEmail || a.artistEmail || a.email || a.user_email)
          .filter(Boolean)
      ).size;

      // Calculate Unique Categories
      const uniqueCategories = new Set(
        artsArray.map((a) => a.category).filter(Boolean)
      ).size;

      const totalLikes = likesRes.data.totalLikes || likesRes.data.total || 0;

      return {
        totalArtworks: artsArray.length,
        totalArtists: uniqueArtists,
        totalCategories: uniqueCategories,
        totalLikes,
      };
    },
    // Keep data fresh but don't refetch too aggressively
    staleTime: 60000,
  });

  const stats = [
    { label: "Artworks Uploaded", value: statData.totalArtworks, suffix: "+" },
    { label: "Active Artists", value: statData.totalArtists, suffix: "" },
    {
      label: "Styles & Categories",
      value: statData.totalCategories,
      suffix: "+",
    },
    { label: "Total Favorites", value: statData.totalLikes, suffix: "+" },
  ];

  return (
    <section className="py-20 bg-primary text-primary-content relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-primary-content/20">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <Fade direction="up" delay={index * 100} triggerOnce>
                <div className="text-4xl md:text-5xl font-black mb-2">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                  />
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-base font-medium opacity-80 uppercase tracking-widest">
                  {stat.label}
                </div>
              </Fade>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
