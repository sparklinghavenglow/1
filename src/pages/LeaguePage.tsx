import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import EventList from "../components/EventList";

export default function LeaguePage() {
  const { id = "" } = useParams();

  const league = useQuery({
    queryKey: ["league", id],
    queryFn: () => api.lookupLeague(id),
    enabled: !!id,
  });
  const teams = useQuery({
    queryKey: ["league-teams", league.data?.strLeague],
    queryFn: () => api.teamsByLeague(league.data!.strLeague),
    enabled: !!league.data?.strLeague,
  });
  const next = useQuery({
    queryKey: ["league-next", id],
    queryFn: () => api.nextLeagueEvents(id),
    enabled: !!id,
  });
  const past = useQuery({
    queryKey: ["league-past", id],
    queryFn: () => api.pastLeagueEvents(id),
    enabled: !!id,
  });

  if (league.isLoading) return <div className="p-6"><Loading /></div>;
  if (league.error) return <div className="p-6"><ErrorMsg error={league.error} /></div>;
  if (!league.data) return <div className="p-6"><Empty>League not found.</Empty></div>;

  const l = league.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-sm text-slate-400 mb-3">
        <Link to="/" className="link">Sports</Link> /{" "}
        <Link to={`/sports/${encodeURIComponent(l.strSport)}`} className="link">
          {l.strSport}
        </Link>{" "}
        / <span className="text-slate-200">{l.strLeague}</span>
      </div>

      <PageHeader
        title={l.strLeague}
        subtitle={[l.strCountry, l.strCurrentSeason, l.strLeagueAlternate]
          .filter(Boolean)
          .join(" · ")}
        image={l.strFanart1 || l.strBanner || l.strPoster}
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-4">
          {l.strBadge && (
            <div className="card p-4 flex items-center justify-center">
              <SmartImage
                src={l.strBadge}
                alt={l.strLeague}
                className="max-h-40 object-contain"
              />
            </div>
          )}
          <div className="card p-4 text-sm space-y-2">
            {l.intFormedYear && (
              <div>
                <span className="text-slate-400">Founded: </span>
                {l.intFormedYear}
              </div>
            )}
            {l.strGender && (
              <div>
                <span className="text-slate-400">Division: </span>
                {l.strGender}
              </div>
            )}
            {l.strWebsite && (
              <div className="truncate">
                <a
                  className="link"
                  href={`https://${l.strWebsite}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.strWebsite}
                </a>
              </div>
            )}
          </div>
          {l.strDescriptionEN && (
            <div className="card p-4 text-sm text-slate-300 whitespace-pre-line max-h-96 overflow-auto leading-relaxed">
              {l.strDescriptionEN}
            </div>
          )}
        </aside>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Teams {teams.data ? `(${teams.data.length})` : ""}
            </h2>
            {teams.isLoading && <Loading rows={4} />}
            {teams.data && teams.data.length === 0 && (
              <Empty>No teams found for this league.</Empty>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(teams.data ?? []).map((t) => (
                <Link key={t.idTeam} to={`/teams/${t.idTeam}`} className="card">
                  <div className="aspect-square bg-panel2 flex items-center justify-center p-4">
                    <SmartImage
                      src={t.strBadge || t.strLogo}
                      alt={t.strTeam}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-sm font-medium truncate">{t.strTeam}</div>
                    {t.strStadium && (
                      <div className="text-xs text-slate-400 truncate">
                        {t.strStadium}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming events</h2>
            {next.isLoading && <Loading rows={3} />}
            <EventList events={next.data ?? []} emptyText="No upcoming events scheduled." />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Recent results</h2>
            {past.isLoading && <Loading rows={3} />}
            <EventList events={past.data ?? []} showScore emptyText="No recent results." />
          </section>
        </div>
      </div>
    </div>
  );
}
