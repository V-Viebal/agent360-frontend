import { Routes, Route, Navigate } from "react-router-dom";
import { GrokBotWorkspace } from "./pages/GrokBotWorkspace";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DocsPage } from "./pages/DocsPage";
import { AgentDetailPage } from "./pages/AgentDetailPage";
import { AgentStatsDashboardPage } from "./pages/AgentStatsDashboardPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <Routes>
      {/* 1. Public Marketing Landing Page at "/" */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <LandingPage />
            </main>
            <Footer />
          </div>
        }
      />
      <Route path="/landing" element={<Navigate to="/" replace />} />

      {/* 2. Authenticated Agent Workspace at "/app" (and alias "/workspace") */}
      <Route path="/app" element={<GrokBotWorkspace />} />
      <Route path="/workspace" element={<Navigate to="/app" replace />} />

      {/* 3. Marketplace Catalog */}
      <Route
        path="/marketplace"
        element={
          <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <MarketplacePage />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Individual Agent Detail Specification Page */}
      <Route
        path="/marketplace/:agentId"
        element={
          <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <AgentDetailPage />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Documentation */}
      <Route
        path="/docs"
        element={
          <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <DocsPage />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Agent Load & Telemetry Analytics Dashboard */}
      <Route
        path="/analytics"
        element={
          <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <AgentStatsDashboardPage />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
