import { ErrorBoundary } from "./components/ErrorBoundary";
import { lazy, Suspense } from "react";
import { AuthGuard } from "./components/AuthGuard";
import { CallbackPage } from './pages/CallbackPage';
import { Routes, Route, Navigate } from "react-router-dom";
import { GrokBotWorkspace } from "./pages/GrokBotWorkspace";
import { LandingPage } from "./pages/LandingPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import { OfflineBanner } from "./components/OfflineBanner";

// Lazy-loaded secondary pages & admin portal to optimize initial bundle size
const MarketplacePage = lazy(() => import("./pages/MarketplacePage").then(m => ({ default: m.MarketplacePage })));
const DocsPage = lazy(() => import("./pages/DocsPage").then(m => ({ default: m.DocsPage })));
const AgentDetailPage = lazy(() => import("./pages/AgentDetailPage").then(m => ({ default: m.AgentDetailPage })));
const AgentStatsDashboardPage = lazy(() => import("./pages/AgentStatsDashboardPage").then(m => ({ default: m.AgentStatsDashboardPage })));
const DesignTokensSandboxPage = lazy(() => import("./pages/DesignTokensSandboxPage").then(m => ({ default: m.DesignTokensSandboxPage })));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const AdminAgentsPage = lazy(() => import("./pages/admin/AdminAgentsPage").then(m => ({ default: m.AdminAgentsPage })));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage").then(m => ({ default: m.AdminUsersPage })));
const AdminBillingsPage = lazy(() => import("./pages/admin/AdminBillingsPage").then(m => ({ default: m.AdminBillingsPage })));
const AdminOrganizationsPage = lazy(() => import("./pages/admin/AdminOrganizationsPage").then(m => ({ default: m.AdminOrganizationsPage })));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage").then(m => ({ default: m.AdminSettingsPage })));
const AdminAuditPage = lazy(() => import("./pages/admin/AdminAuditPage").then(m => ({ default: m.AdminAuditPage })));

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <OfflineBanner />
        <Suspense fallback={<div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-secondary)] flex items-center justify-center text-xs font-mono">Loading...</div>}>
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

      {/* 2. Authenticated Agent Workspace at "/app", "/app/:agentParam", and "/app/:agentParam/:chatParam" */}
      <Route path="/app" element={<AuthGuard><GrokBotWorkspace /></AuthGuard>} />
      <Route path="/app/:agentParam" element={<AuthGuard><GrokBotWorkspace /></AuthGuard>} />
      <Route path="/app/:agentParam/:chatParam" element={<AuthGuard><GrokBotWorkspace /></AuthGuard>} />
      <Route path="/workspace" element={<Navigate to="/app" replace />} />
      <Route path="/workspace/:agentParam" element={<AuthGuard><GrokBotWorkspace /></AuthGuard>} />
      <Route path="/workspace/:agentParam/:chatParam" element={<AuthGuard><GrokBotWorkspace /></AuthGuard>} />

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
      <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
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
        </Suspense>
      </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
