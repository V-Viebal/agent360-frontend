import { Routes, Route, Navigate } from "react-router-dom";
import { GrokBotWorkspace } from "./pages/GrokBotWorkspace";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DocsPage } from "./pages/DocsPage";
import { AgentDetailPage } from "./pages/AgentDetailPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <Routes>
      {/* Primary: Exact Grok Bot layout matching user screenshot */}
      <Route path="/" element={<GrokBotWorkspace />} />
      <Route path="/workspace" element={<GrokBotWorkspace />} />

      {/* Marketing Landing Page */}
      <Route
        path="/landing"
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

      {/* Marketplace Catalog: x.ai & AI Teammates Multi-Agent Teammate Templates */}
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

      {/* Documentation (AI Teammates structure + QwenPaw specs) */}
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

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
