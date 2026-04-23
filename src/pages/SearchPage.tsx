import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import EventList from "../components/EventList";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const teams = useQuery({
    queryKey: ["search-teams", q],
    queryFn: () => api.searchTeams(q),
    enabled: !!q,
  });
  const events = useQuery({
    queryKey: ["search-events", q],
    queryFn: () => api.searchEvents(q),
    enabled: !!q,
  });

  if (!q)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Empty>Type something in the search bar above to get started.</Empty>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <PageHeader
        title={`Results for "${q}"`}
        subtitle="Teams and events matching your query across every sport in our database."
      />

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Teams {teams.data ? `(${teams.data.length})` : ""}
        </h2>
        {teams.isLoading && <Loading rows={4} />}
        {teams.error && <ErrorMsg error={teams.error} />}
        {teams.data && teams.data.length === 0 && <Empty>No teams found.</Empty>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {(teams.data ?? []).map((t) => (
            <Link key={t.idTeam} to={`/teams/${t.idTeam}`} className="card">
              <div className="aspect-square bg-panel2 flex items-center justify-center p-3">
                <SmartImage
                  src={t.strBadge || t.strLogo}
                  alt={t.strTeam}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-2.5">
                <div className="text-sm font-medium truncate">{t.strTeam}</div>
                <div className="text-xs text-slate-400 truncate">
                  {[t.strSport, t.strLeague].filter(Boolean).join(" · ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Events {events.data ? `(${events.data.length})` : ""}
        </h2>
        {events.isLoading && <Loading rows={3} />}
        {events.data && events.data.length === 0 && <Empty>No events found.</Empty>}
        <EventList events={events.data ?? []} showScore />
      </section>
    </div>
  );
}
