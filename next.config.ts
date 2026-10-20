import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  // Toutes les redirections sont en 301 (statusCode), et non en 308 (permanent: true) :
  // le 301 est le code de redirection définitive le plus largement reconnu par les robots.
  async redirects() {
    return [
      // Filet de sécurité www -> domaine principal (la redirection principale doit être faite dans Apache).
      // Apache (mod_proxy) transmet l'hôte d'origine dans x-forwarded-host ; "host" couvre ProxyPreserveHost On.
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-host", value: "[wW]{3}\\.[lL][eE][aA]-[nN][uU][mM][eE][rR][iI][qQ][uU][eE]\\.[fF][rR](?::\\d+)?(?:\\s*,.*)?" }],
        destination: "https://lea-numerique.fr/:path*",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lea-numerique.fr" }],
        destination: "https://lea-numerique.fr/:path*",
        statusCode: 301,
      },

      // Anciennes URLs de l'ancien site (type Shopify), signalées en 404 dans Google Search Console.
      // Règles précises d'abord, filets de sécurité ensuite (la première règle qui correspond s'applique).
      { source: "/pages/services", destination: "/services", statusCode: 301 },
      { source: "/collections/frontpage", destination: "/", statusCode: 301 },
      { source: "/pages/partenaires", destination: "/a-propos", statusCode: 301 },
      // Téléphone IP de bureau : la page téléphonie IP est la cible la plus proche.
      { source: "/products/snom-d150", destination: "/solutions/telephonie-ip", statusCode: 301 },

      // Filets de sécurité pour les autres anciennes URLs de l'ancien site
      { source: "/products/:slug*", destination: "/solutions", statusCode: 301 },
      { source: "/collections/:slug*", destination: "/solutions", statusCode: 301 },
      { source: "/pages/:slug*", destination: "/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
