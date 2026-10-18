export const authConfig = {
  // Dedicated Skyer (Agent360) Logto Identity Authority
  endpoint: "https://auth-skyer.hmz.one/",
  appId: "skyer-prod-app",
  localAppId: "skyer-local-app",
  apiResource: "https://api-agent360.antares.vn",
  redirectUri: typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? `${window.location.origin}/callback`
    : "https://agent360.antares.vn/callback",
  postLogoutRedirectUri: typeof window !== "undefined"
    ? window.location.origin
    : "https://agent360.antares.vn",
};
