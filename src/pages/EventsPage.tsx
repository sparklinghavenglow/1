import { useQueries } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Loading, PageHeader, Empty } from "../components/States";
import EventList from "../components/EventList";

// Top leagues across several sports so the page gives a global feel
// using free API endpoints (no premium required).
const FEATURED_LEAGUE_IDS: { id: string; name: string }[] = [
  { id: "4328", name: "English Premier League" },
  { id: "4335", name: "Spanish La Liga" },
  { id: "4331", name: "German Bundesliga" },
  { id: "4332", name: "Italian Serie A" },
  { id: "4334", name: "French Ligue 1" },
  { id: "4387", name: "NBA" },
  { id: "4391", name: "NFL" },
  { id: "4424", name: "MLB" },
  { id: "4380", name: "NHL" },
  { id: "4346", name: "MLS" },
  { id: "4370", name: "Formula 1" },
  { id: "4464", name: "IPL Cricket" },
  { id: "4405", name: "Rugby Premiership" },
  { id: "4431", name: "UFC" },
];

export default function EventsPage() {
  const results = useQueries({
    queries: FEATURED_LEAGUE_IDS.map((l) => ({
      queryKey: ["next", l.id],
      queryFn: () => api.nextLeagueEvents(l.id),
    })),
  });

  const anyLoading = results.some((r) => r.isLoading);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <PageHeader
        title="Upcoming events worldwide"
        subtitle="A tour of what's on next across major leagues spanning soccer, basketball, American football, cricket, F1, and more."
      />

      {anyLoading && <Loading rows={4} />}

      <div className="space-y-8">
        {FEATURED_LEAGUE_IDS.map((l, i) => {
          const events = results[i].data ?? [];
          if (!events.length) return null;
          return (
            <section key={l.id}>
              <h2 className="text-lg font-semibold mb-3">{l.name}</h2>
              <EventList events={events.slice(0, 6)} />
            </section>
          );
        })}
      </div>

      {!anyLoading && results.every((r) => (r.data ?? []).length === 0) && (
        <Empty>No upcoming events returned right now.</Empty>
      )}
    </div>
  );
}
