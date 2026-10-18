import { CallbackPage } from './pages/CallbackPage';
import { Routes, Route, Navigate } from "react-router-dom";
import { GrokBotWorkspace } from "./pages/GrokBotWorkspace";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DocsPage } from "./pages/DocsPage";
import { AgentDetailPage } from "./pages/AgentDetailPage";
import { AgentStatsDashboardPage } from "./pages/AgentStatsDashboardPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import { OfflineBanner } from "./components/OfflineBanner";
import { DesignTokensSandboxPage } from "./pages/DesignTokensSandboxPage";

// Admin Portal Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminAgentsPage } from "./pages/admin/AdminAgentsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminBillingsPage } from "./pages/admin/AdminBillingsPage";
import { AdminOrganizationsPage } from "./pages/admin/AdminOrganizationsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminAuditPage } from "./pages/admin/AdminAuditPage";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineBanner />
      <Routes>
      {/* 1. Public Marketing Landing Page at "/" */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
            <Navbar />
            <main className="flex-1">
              <LandingPage />
            </main>
            <Footer />
          </div>
        }
      />
      <Route path="/landing" element={<Navigate to="/" replace />} />

      {/* Logto OIDC Auth Callback */}
      <Route path="/callback" element={<CallbackPage />} />

      {/* 2. Authenticated Agent Workspace at "/app" (and alias "/workspace") */}
      <Route path="/app" element={<GrokBotWorkspace />} />
      <Route path="/workspace" element={<Navigate to="/app" replace />} />

      {/* 3. Marketplace Catalog */}
      <Route
        path="/marketplace"
        element={
          <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
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
          <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
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
          <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
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
          <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
            <Navbar />
            <main className="flex-1">
              <AgentStatsDashboardPage />
            </main>
            <Footer />
          </div>
        }
      />

      {/* UI Design Tokens & Theme Sandbox */}
      <Route path="/design-tokens" element={<DesignTokensSandboxPage />} />

      {/* 4. Admin Portal System Routes (/admin/*) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="agents" element={<AdminAgentsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="billings" element={<AdminBillingsPage />} />
        <Route path="organizations" element={<AdminOrganizationsPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </LanguageProvider>
    </ThemeProvider>
  );
}
