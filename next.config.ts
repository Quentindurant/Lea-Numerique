import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    // Filet de sécurité www -> domaine principal (la redirection principale doit être faite dans Apache).
    // Apache (mod_proxy) transmet l'hôte d'origine dans x-forwarded-host ; "host" couvre ProxyPreserveHost On.
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-host", value: "[wW]{3}\\.[lL][eE][aA]-[nN][uU][mM][eE][rR][iI][qQ][uU][eE]\\.[fF][rR](?:\\s*,.*)?" }],
        destination: "https://lea-numerique.fr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lea-numerique.fr" }],
        destination: "https://lea-numerique.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
