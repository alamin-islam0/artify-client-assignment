// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";

/* Avatar helper copied from FeaturedArtworks.jsx */
function Avatar({ name = "Artist", photoURL }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
      />
    );
  }
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-8 w-8 rounded-full grid place-items-center bg-primary text-white text-xs font-bold ring-2 ring-primary/20">
      {initials}
    </div>
  );
}

/* Card component EXACTLY like FeaturedArtworks */
function ArtworkCard({ a, loading }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-base-200" />
        )}

        <img
          src={a?.image}
          alt={a?.title || "Artwork"}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        {!loading && (
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="badge badge-primary font-semibold">
              {a?.category || "Artwork"}
            </span>
            {a?.medium && (
              <span className="badge bg-base-100/80 backdrop-blur text-xs">
                {a.medium}
              </span>
            )}
          </div>
        )}

        {/* Title gradient */}
        {!loading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold inter-font line-clamp-1">
          {loading ? (
            <span className="inline-block h-5 w-2/3 animate-pulse rounded bg-base-200" />
          ) : (
            a?.title
          )}
        </h3>

        {/* Artist */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="h-8 w-8 animate-pulse rounded-full bg-base-200" />
            ) : (
              <Avatar name={a?.artist?.name} photoURL={a?.artist?.photoURL} />
            )}

            <div className="leading-tight">
              <p className="text-sm font-semibold inter-font">
                {loading ? (
                  <span className="inline-block h-4 w-28 animate-pulse rounded bg-base-200" />
                ) : (
                  a?.artist?.name || "Unknown Artist"
                )}
              </p>
              <p className="text-xs opacity-60 montserrat-font">
                {loading ? (
                  <span className="inline-block h-3 w-20 animate-pulse rounded bg-base-200" />
                ) : a?.visibility === "private" ? (
                  "Private"
                ) : (
                  "Public"
                )}
              </p>
            </div>
          </div>

          {!loading && typeof a?.likes === "number" && (
            <div className="badge bg-base-200 text-xs font-semibold">
              ♥ {a.likes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/art/${a?._id}`}
            className="btn btn-primary btn-sm montserrat-font"
          >
            View Details
          </Link>

          <span className="text-sm font-semibold text-primary montserrat-font">
            {a?.category}
          </span>
        </div>
      </div>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-primary/0 group-hover:ring-2 group-hover:ring-primary/20 transition-all" />
    </div>
  );
}

export default function Explore() {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["explore-arts", filters.search, filters.category, currentPage],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        category: filters.category,
      };
      const res = await axiosPublic.get("/arts", { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  // Extract list and total count
  let list = [];
  let totalCount = 0;

  if (data) {
    if (Array.isArray(data)) {
      list = data;
      // If the API returns just an array, we try to use its length,
      // but proper pagination requires a total count field from the backend.
      // We will fallback to list.length if no total is provided,
      // which effectively disables pagination if the backend doesn't support it well.
      totalCount = data.length;
    } else {
      list = data.data || [];
      totalCount = data.total || data.count || data.totalDocs || 0;
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setFilters((prev) => ({ ...prev, category: newCat }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const loadingState = isLoading;

  // Pagination Helper
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 lg:mt-24 mt-16">
      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold inter-font">Explore Artworks</h2>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Search, filter, and discover more artworks.
        </p>
      </header>

      {/* SEARCH AREA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search title or artist..."
          className="input input-bordered w-full montserrat-font"
        />

        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="select select-bordered montserrat-font w-full sm:w-48"
        >
          <option value="">All Categories</option>
          <option>Painting</option>
          <option>Digital</option>
          <option>Sculpture</option>
          <option>Photography</option>
          <option>Sketch</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(loadingState ? Array.from({ length: 6 }) : list).map((a, idx) => (
          <ArtworkCard key={a?._id ?? idx} a={a} loading={loadingState} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loadingState && list.length === 0 && (
        <div className="mt-10 text-center border border-dashed border-base-300 p-10 rounded-xl">
          <h3 className="text-lg font-semibold inter-font">
            No artworks found
          </h3>
          <p className="opacity-70 montserrat-font">
            Try another search or category.
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {!loadingState && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>

            {getPageNumbers().map((p, idx) => (
              <button
                key={idx}
                className={`join-item btn ${
                  p === currentPage ? "btn-active btn-primary" : ""
                } ${p === "..." ? "btn-disabled" : ""}`}
                onClick={() => typeof p === "number" && handlePageChange(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
