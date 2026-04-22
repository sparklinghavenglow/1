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

        {p.strDescriptionEN && (
          <div className="card p-5 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {p.strDescriptionEN}
          </div>
        )}
      </div>
    </div>
  );
}
