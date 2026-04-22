import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import { useMemo, useState } from "react";

export default function SportPage() {
  const { sport = "" } = useParams();
  const name = decodeURIComponent(sport);
  const [filter, setFilter] = useState("");
  const [country, setCountry] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["leagues", name],
    queryFn: () => api.leaguesBySport(name),
    enabled: !!name,
  });

  const countries = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((l) => l.strCountry && set.add(l.strCountry));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return (data ?? []).filter((l) => {
      if (country && l.strCountry !== country) return false;
      if (!q) return true;
      return (
        l.strLeague.toLowerCase().includes(q) ||
        (l.strLeagueAlternate ?? "").toLowerCase().includes(q) ||
        (l.strCountry ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, filter, country]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-sm text-slate-400 mb-3">
        <Link to="/" className="link">
          Sports
        </Link>{" "}
        / <span className="text-slate-200">{name}</span>
      </div>

      <PageHeader
        title={`${name} leagues`}
        subtitle={`Browse every ${name.toLowerCase()} league we have data for, grouped by country.`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="input py-2 sm:max-w-sm"
          placeholder="Filter leagues..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="input py-2 sm:max-w-xs"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All countries ({countries.length})</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="sm:ml-auto text-sm text-slate-400 self-center">
          {filtered.length} of {data?.length ?? 0} leagues
        </div>
      </div>

      {isLoading && <Loading />}
      {error && <ErrorMsg error={error} />}
      {data && filtered.length === 0 && <Empty>No leagues match.</Empty>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <Link key={l.idLeague} to={`/leagues/${l.idLeague}`} className="card">
            <div className="aspect-[16/9] relative bg-panel2">
              <SmartImage
                src={l.strBanner || l.strFanart1 || l.strPoster || l.strLogo}
                alt={l.strLeague}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
              {l.strBadge && (
                <div className="absolute top-2 left-2 w-12 h-12 bg-ink/70 rounded-lg p-1.5 flex items-center justify-center">
                  <SmartImage
                    src={l.strBadge}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="absolute bottom-2 left-3 right-3">
                <div className="font-semibold truncate">{l.strLeague}</div>
                <div className="text-xs text-slate-300 flex gap-2">
                  {l.strCountry && <span>{l.strCountry}</span>}
                  {l.strCurrentSeason && (
                    <span className="text-slate-400">
                      · {l.strCurrentSeason}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
