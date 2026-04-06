import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@digitalcrew/auth"],
}

export default withNextIntl(nextConfig)
