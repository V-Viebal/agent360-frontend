export const authConfig = {
  endpoint: "https://ma-auth-2nd.hmz.one/",
  appId: "e18o9m0sj3dysp3hyejkp",
  localAppId: "yjoqf5j4ecrara4pyge93",
  apiResource: "https://api-agent360.antares.vn",
  redirectUri: typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? `${window.location.origin}/callback`
    : "https://agent360.antares.vn/callback",
  postLogoutRedirectUri: typeof window !== "undefined"
    ? window.location.origin
    : "https://agent360.antares.vn",
};
