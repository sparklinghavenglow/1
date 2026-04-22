import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import EventList from "../components/EventList";

export default function TeamPage() {
  const { id = "" } = useParams();

  const team = useQuery({
    queryKey: ["team", id],
    queryFn: () => api.lookupTeam(id),
    enabled: !!id,
  });
  const players = useQuery({
    queryKey: ["team-players", id],
    queryFn: () => api.playersByTeam(id),
    enabled: !!id,
  });
  const next = useQuery({
    queryKey: ["team-next", id],
    queryFn: () => api.nextTeamEvents(id),
    enabled: !!id,
  });
  const last = useQuery({
    queryKey: ["team-last", id],
    queryFn: () => api.lastTeamEvents(id),
    enabled: !!id,
  });

  if (team.isLoading) return <div className="p-6"><Loading /></div>;
  if (team.error) return <div className="p-6"><ErrorMsg error={team.error} /></div>;
  if (!team.data) return <div className="p-6"><Empty>Team not found.</Empty></div>;

  const t = team.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-sm text-slate-400 mb-3">
        <Link to="/" className="link">Sports</Link> /{" "}
        <Link to={`/sports/${encodeURIComponent(t.strSport)}`} className="link">
          {t.strSport}
        </Link>{" "}
        /{" "}
        <Link to={`/leagues/${t.idLeague}`} className="link">
          {t.strLeague}
        </Link>{" "}
        / <span className="text-slate-200">{t.strTeam}</span>
      </div>

      <PageHeader
        title={t.strTeam}
        subtitle={[t.strCountry, t.strStadium, t.intFormedYear && `Est. ${t.intFormedYear}`]
          .filter(Boolean)
          .join(" · ")}
        image={t.strFanart1 || t.strBanner}
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-4">
          {(t.strBadge || t.strLogo) && (
            <div className="card p-5 flex items-center justify-center">
              <SmartImage
                src={t.strBadge || t.strLogo}
                alt={t.strTeam}
                className="max-h-48 object-contain"
              />
            </div>
          )}
          <div className="card p-4 text-sm space-y-2">
            {t.strLeague && (
              <div>
                <span className="text-slate-400">League: </span>
                <Link to={`/leagues/${t.idLeague}`} className="link">
                  {t.strLeague}
                </Link>
              </div>
            )}
            {t.strStadium && (
              <div>
                <span className="text-slate-400">Stadium: </span>
                {t.strStadium}
                {t.strStadiumLocation ? ` (${t.strStadiumLocation})` : ""}
              </div>
            )}
            {t.strWebsite && (
              <div className="truncate">
                <a
                  className="link"
                  href={`https://${t.strWebsite}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.strWebsite}
                </a>
              </div>
            )}
          </div>
          {t.strDescriptionEN && (
            <div className="card p-4 text-sm text-slate-300 whitespace-pre-line max-h-96 overflow-auto leading-relaxed">
              {t.strDescriptionEN}
            </div>
          )}
        </aside>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Squad {players.data ? `(${players.data.length})` : ""}
            </h2>
            {players.isLoading && <Loading rows={4} />}
            {players.data && players.data.length === 0 && (
              <Empty>No roster data for this team.</Empty>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(players.data ?? []).map((p) => (
                <Link key={p.idPlayer} to={`/players/${p.idPlayer}`} className="card">
                  <div className="aspect-square bg-panel2 relative overflow-hidden">
                    <SmartImage
                      src={p.strCutout || p.strThumb || p.strRender}
                      alt={p.strPlayer}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-sm font-medium truncate">{p.strPlayer}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {[p.strPosition, p.strNationality].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming</h2>
            {next.isLoading && <Loading rows={3} />}
            <EventList events={next.data ?? []} emptyText="No upcoming events." />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Recent results</h2>
            {last.isLoading && <Loading rows={3} />}
            <EventList events={last.data ?? []} showScore emptyText="No recent results." />
          </section>
        </div>
      </div>
    </div>
  );
}
