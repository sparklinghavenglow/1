import { Link } from "react-router-dom";
import type { SportEvent } from "../lib/api";
import { Empty } from "./States";

interface Props {
  events: SportEvent[];
  showScore?: boolean;
  emptyText?: string;
}

export default function EventList({ events, showScore, emptyText }: Props) {
  if (!events || events.length === 0)
    return <Empty>{emptyText ?? "No events."}</Empty>;
  return (
    <div className="space-y-2">
      {events.map((e) => (
        <div
          key={e.idEvent}
          className="flex items-center gap-3 card px-4 py-3"
        >
          <div className="w-20 shrink-0 text-xs text-slate-400">
            {e.dateEvent}
            {e.strTime ? (
              <div className="text-slate-300">{e.strTime.slice(0, 5)}</div>
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
              {e.strHomeTeam && e.strAwayTeam ? (
                <>
                  {e.idHomeTeam ? (
                    <Link to={`/teams/${e.idHomeTeam}`} className="hover:text-accent">
                      {e.strHomeTeam}
                    </Link>
                  ) : (
                    e.strHomeTeam
                  )}
                  <span className="text-slate-500"> vs </span>
                  {e.idAwayTeam ? (
                    <Link to={`/teams/${e.idAwayTeam}`} className="hover:text-accent">
                      {e.strAwayTeam}
                    </Link>
                  ) : (
                    e.strAwayTeam
                  )}
                </>
              ) : (
                e.strEvent
              )}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {[e.strLeague, e.strVenue].filter(Boolean).join(" · ")}
            </div>
          </div>
          {showScore && (e.intHomeScore ?? null) !== null && e.intHomeScore !== "" && (
            <div className="font-mono text-sm tabular-nums bg-panel2 border border-edge rounded px-2 py-1">
              {e.intHomeScore} – {e.intAwayScore}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
