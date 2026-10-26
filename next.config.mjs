import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@digitalcrew/auth"],
  // French was removed as a UI locale (ENG-02): send old /fr links to the English pages.
  async redirects() {
    return [
      { source: "/fr", destination: "/en", permanent: true },
      { source: "/fr/:path*", destination: "/en/:path*", permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
