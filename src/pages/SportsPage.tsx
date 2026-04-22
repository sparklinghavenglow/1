import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import { useMemo, useState } from "react";

export default function SportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sports"],
    queryFn: api.allSports,
  });
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = filter.trim().toLowerCase();
    return q
      ? data.filter((s) => s.strSport.toLowerCase().includes(q))
      : data;
  }, [data, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <PageHeader
        title="Every sport on the planet"
        subtitle="Browse leagues, teams, players and events across the world of sport. Pick a sport to dive in."
      />

      <div className="mb-4 max-w-sm">
        <input
          className="input py-2"
          placeholder="Filter sports..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {isLoading && <Loading />}
      {error && <ErrorMsg error={error} />}
      {data && filtered.length === 0 && <Empty>No sports match that filter.</Empty>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((s) => (
          <Link
            key={s.idSport}
            to={`/sports/${encodeURIComponent(s.strSport)}`}
            className="card group"
          >
            <div className="aspect-[16/10] relative">
              <SmartImage
                src={s.strSportThumb}
                alt={s.strSport}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                <SmartImage
                  src={s.strSportIconGreen}
                  alt=""
                  className="w-6 h-6"
                />
                <span className="font-semibold truncate">{s.strSport}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
