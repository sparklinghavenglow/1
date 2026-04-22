import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import SportsPage from "./pages/SportsPage";
import SportPage from "./pages/SportPage";
import LeaguePage from "./pages/LeaguePage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import EventsPage from "./pages/EventsPage";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<SportsPage />} />
            <Route path="sports/:sport" element={<SportPage />} />
            <Route path="leagues/:id" element={<LeaguePage />} />
            <Route path="teams/:id" element={<TeamPage />} />
            <Route path="players/:id" element={<PlayerPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
