export const authConfig = {
  // Dedicated Skyer (Agent360) Logto Identity Authority
  endpoint: "https://auth-skyer.hmz.one/",
  appId: "skyer-prod-app",
  localAppId: "skyer-local-app",
  apiResource: "https://api-agent360.antares.vn",
  // Logto issues an API scope only when it is requested. admin:all is granted to users holding the
  // Logto "admin" role; others simply receive a token without it.
  apiScopes: ["admin:all"],
  // Each deployed origin (production, staging, localhost) must be registered on the Logto SPA app.
  redirectUri: typeof window !== "undefined"
    ? `${window.location.origin}/callback`
    : "https://agent360.antares.vn/callback",
  postLogoutRedirectUri: typeof window !== "undefined"
    ? window.location.origin
    : "https://agent360.antares.vn",
};
