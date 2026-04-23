import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";

export default function PlayerPage() {
  const { id = "" } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["player", id],
    queryFn: () => api.lookupPlayer(id),
    enabled: !!id,
  });
  const honours = useQuery({
    queryKey: ["player-honours", id],
    queryFn: () => api.playerHonours(id),
    enabled: !!id,
  });
  const former = useQuery({
    queryKey: ["player-former", id],
    queryFn: () => api.playerFormerTeams(id),
    enabled: !!id,
  });
  const contracts = useQuery({
    queryKey: ["player-contracts", id],
    queryFn: () => api.playerContracts(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6"><Loading /></div>;
  if (error) return <div className="p-6"><ErrorMsg error={error} /></div>;
  if (!data) return <div className="p-6"><Empty>Player not found.</Empty></div>;

  const p = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-sm text-slate-400 mb-3">
        <Link to="/" className="link">Sports</Link>
        {p.strSport && (
          <>
            {" / "}
            <Link to={`/sports/${encodeURIComponent(p.strSport)}`} className="link">
              {p.strSport}
            </Link>
          </>
        )}
        {p.strTeam && (
          <>
            {" / "}
            <Link to={`/teams/${p.idTeam}`} className="link">
              {p.strTeam}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-slate-200">{p.strPlayer}</span>
      </div>

      <PageHeader
        title={p.strPlayer}
        subtitle={[p.strPosition, p.strNationality, p.strTeam]
          .filter(Boolean)
          .join(" · ")}
        image={p.strBanner || p.strRender || p.strThumb}
      />

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <SmartImage
              src={p.strCutout || p.strThumb || p.strRender}
              alt={p.strPlayer}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="card p-4 text-sm space-y-2">
            {p.dateBorn && (
              <div>
                <span className="text-slate-400">Born: </span>
                {p.dateBorn} {p.strBirthLocation ? `(${p.strBirthLocation})` : ""}
              </div>
            )}
            {p.strHeight && (
              <div>
                <span className="text-slate-400">Height: </span>
                {p.strHeight}
              </div>
            )}
            {p.strWeight && (
              <div>
                <span className="text-slate-400">Weight: </span>
                {p.strWeight}
              </div>
            )}
            {p.strNumber && (
              <div>
                <span className="text-slate-400">Number: </span>
                {p.strNumber}
              </div>
            )}
            {p.strStatus && (
              <div>
                <span className="text-slate-400">Status: </span>
                {p.strStatus}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-6 min-w-0">
          {p.strDescriptionEN && (
            <div className="card p-5 text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-96 overflow-auto">
              {p.strDescriptionEN}
            </div>
          )}

          {honours.data && honours.data.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Honours ({honours.data.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {honours.data.map((h) => (
                  <div
                    key={h.id}
                    className="card p-3 flex items-center gap-3 min-w-0"
                  >
                    {h.strHonourLogo && (
                      <SmartImage
                        src={h.strHonourLogo}
                        alt=""
                        className="w-10 h-10 object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {h.strHonour}
                      </div>
                      <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                        {h.strTeamBadge && (
                          <SmartImage
                            src={h.strTeamBadge}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span className="truncate">
                          {h.strTeam}
                          {h.strSeason ? ` · ${h.strSeason}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {former.data && former.data.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Former teams ({former.data.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {former.data.map((t) => (
                  <Link
                    key={t.id}
                    to={`/teams/${t.idFormerTeam}`}
                    className="card p-3 flex items-center gap-3 min-w-0"
                  >
                    {t.strBadge && (
                      <SmartImage
                        src={t.strBadge}
                        alt=""
                        className="w-10 h-10 object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {t.strFormerTeam}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {t.strJoined ?? "?"} – {t.strDeparted ?? "?"}
                        {t.strMoveType ? ` · ${t.strMoveType}` : ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {contracts.data && contracts.data.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Contracts ({contracts.data.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contracts.data.map((c) => (
                  <div
                    key={c.id}
                    className="card p-3 flex items-center gap-3 min-w-0"
                  >
                    {c.strBadge && (
                      <SmartImage
                        src={c.strBadge}
                        alt=""
                        className="w-10 h-10 object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {c.strTeam}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {c.strYearStart ?? "?"} – {c.strYearEnd ?? "?"}
                        {c.strWage ? ` · ${c.strWage}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
