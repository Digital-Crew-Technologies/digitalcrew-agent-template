
export function localizedAppUrl(locale: string, path: string) {
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ).replace(
    /\/$/,
    ""
  )
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${origin}/${locale}${normalized}`
}
