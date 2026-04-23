import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api, type SportEvent } from "../lib/api";
import { Loading, ErrorMsg, Empty, PageHeader } from "../components/States";
import { SmartImage } from "../components/Image";
import { useMemo } from "react";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function isLive(e: SportEvent): boolean {
  const s = (e.strStatus ?? "").toLowerCase();
  if (!s) return false;
  if (["ft", "aet", "pen", "finished", "postponed", "cancelled", "ns", "not started"].some((k) => s.includes(k))) {
    return false;
  }
  return s.includes("1h") || s.includes("2h") || s.includes("ht") || s.includes("live") || s.includes("in progress") || /\d/.test(s);
}

function hasScore(e: SportEvent): boolean {
  return (
    (e.intHomeScore ?? "") !== "" &&
    e.intHomeScore != null &&
    (e.intAwayScore ?? "") !== "" &&
    e.intAwayScore != null
  );
}

function EventCard({ e }: { e: SportEvent }) {
  const live = isLive(e);
  const finished = (e.strStatus ?? "").toLowerCase().includes("ft") || hasScore(e) && !live;

  return (
    <div className="card p-4 flex items-center gap-3 min-w-0">
      <div className="w-16 text-xs text-slate-400 shrink-0 text-center">
        {live ? (
          <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
        ) : finished ? (
          <span className="text-slate-300">FT</span>
        ) : (
          <>
            <div>{e.strTime?.slice(0, 5) ?? "--:--"}</div>
            <div className="text-slate-500">{e.dateEvent?.slice(5)}</div>
          </>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm flex items-center gap-2 min-w-0">
          {(e as SportEvent & { strHomeTeamBadge?: string }).strHomeTeamBadge && (
            <SmartImage
              src={(e as SportEvent & { strHomeTeamBadge?: string }).strHomeTeamBadge}
              alt=""
              className="w-5 h-5 shrink-0 object-contain"
            />
          )}
          {e.idHomeTeam ? (
            <Link to={`/teams/${e.idHomeTeam}`} className="hover:text-accent truncate">
              {e.strHomeTeam}
            </Link>
          ) : (
            <span className="truncate">{e.strHomeTeam ?? e.strEvent}</span>
          )}
        </div>
        <div className="font-medium text-sm flex items-center gap-2 min-w-0 mt-0.5">
          {(e as SportEvent & { strAwayTeamBadge?: string }).strAwayTeamBadge && (
            <SmartImage
              src={(e as SportEvent & { strAwayTeamBadge?: string }).strAwayTeamBadge}
              alt=""
              className="w-5 h-5 shrink-0 object-contain"
            />
          )}
          {e.idAwayTeam ? (
            <Link to={`/teams/${e.idAwayTeam}`} className="hover:text-accent truncate">
              {e.strAwayTeam}
            </Link>
          ) : (
            <span className="truncate">{e.strAwayTeam}</span>
          )}
        </div>
        <div className="text-xs text-slate-400 truncate mt-1">
          {[e.strLeague, e.strVenue].filter(Boolean).join(" · ")}
        </div>
      </div>

      {hasScore(e) && (
        <div className="font-mono text-lg tabular-nums text-right shrink-0">
          <div className={live ? "text-red-400" : ""}>{e.intHomeScore}</div>
          <div className={live ? "text-red-400" : ""}>{e.intAwayScore}</div>
        </div>
      )}
    </div>
  );
}

export default function LivePage() {
  const date = todayISO();
  const { data, isLoading, error } = useQuery({
    queryKey: ["eventsday", date],
    queryFn: () => api.eventsDay(date),
    refetchInterval: 60_000,
  });

  const grouped = useMemo(() => {
    const by: Record<string, SportEvent[]> = {};
    (data ?? []).forEach((e) => {
      const key = e.strSport || "Other";
      (by[key] ||= []).push(e);
    });
    Object.values(by).forEach((arr) =>
      arr.sort((a, b) => (a.strTimestamp ?? "").localeCompare(b.strTimestamp ?? ""))
    );
    return by;
  }, [data]);

  const live = (data ?? []).filter(isLive);
  const finished = (data ?? []).filter(
    (e) => !isLive(e) && hasScore(e)
  );
  const upcoming = (data ?? []).filter(
    (e) => !isLive(e) && !hasScore(e)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <PageHeader
        title="Live & Today"
        subtitle={`Every match happening on ${date} across every sport TheSportsDB tracks — live scores auto-refresh every minute.`}
      />

      {isLoading && <Loading rows={6} />}
      {error && <ErrorMsg error={error} />}

      {data && data.length === 0 && (
        <Empty>No events scheduled for today in TheSportsDB's free data.</Empty>
      )}

      {live.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live now ({live.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {live.map((e) => (
              <EventCard key={e.idEvent} e={e} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            Upcoming today ({upcoming.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {upcoming.slice(0, 60).map((e) => (
              <EventCard key={e.idEvent} e={e} />
            ))}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            Final results today ({finished.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {finished.slice(0, 60).map((e) => (
              <EventCard key={e.idEvent} e={e} />
            ))}
          </div>
        </section>
      )}

      {Object.keys(grouped).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-slate-400">By sport</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(grouped).map(([sport, arr]) => (
              <Link
                key={sport}
                to={`/sports/${encodeURIComponent(sport)}`}
                className="chip hover:border-accent/60"
              >
                <span>{sport}</span>
                <span className="text-slate-500">· {arr.length}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
