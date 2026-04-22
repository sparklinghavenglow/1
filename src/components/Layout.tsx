import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    nav(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-ink/80 border-b border-edge">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent2" />
            <span className="font-bold tracking-tight text-lg">
              World Sports Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "text-white" : "hover:text-white"
              }
            >
              Sports
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "text-white" : "hover:text-white"
              }
            >
              Upcoming Events
            </NavLink>
          </nav>

          <form onSubmit={onSearch} className="flex-1 max-w-xl ml-auto">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search teams, events, players..."
                className="input pl-10 py-2"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </form>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-edge mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-xs text-slate-400 flex flex-col sm:flex-row gap-2 sm:gap-6">
          <span>
            Data &amp; imagery courtesy of{" "}
            <a
              className="link"
              href="https://www.thesportsdb.com"
              target="_blank"
              rel="noreferrer"
            >
              TheSportsDB
            </a>{" "}
            (free tier).
          </span>
          <span className="sm:ml-auto">
            Coverage varies by sport. Logos &amp; photos © their respective
            owners.
          </span>
        </div>
      </footer>
    </div>
  );
}
