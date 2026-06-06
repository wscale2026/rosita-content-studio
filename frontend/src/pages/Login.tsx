function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF]">
      <div className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#6750A4] mb-2">
            <span className="text-white font-semibold text-2xl">R</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
              Rosita Content Studio
            </h1>
            <p className="text-sm text-[#49454F] mt-2">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>
          <button
            className="w-full py-3 px-6 rounded-xl bg-[#6750A4] text-white font-medium text-sm hover:bg-[#4F378B] transition-colors shadow-md"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Se connecter avec Kimi
          </button>
        </div>
      </div>
    </div>
  );
}
