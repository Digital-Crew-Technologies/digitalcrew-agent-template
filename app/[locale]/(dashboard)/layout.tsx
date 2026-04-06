import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { routing } from "@/lib/i18n/routing"
import { getServerSession } from "@/lib/auth/session"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function stripLocalePrefix(pathname: string) {
  for (const loc of routing.locales) {
    const prefix = `/${loc}`
    if (pathname === prefix) return "/"
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/"
    }
  }
  return pathname
}

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params
  const session = await getServerSession()

  if (!session) {
    const pathname = (await headers()).get("x-pathname") ?? `/${locale}/dashboard`
    const returnTo = stripLocalePrefix(pathname)
    const qs = returnTo && returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
    redirect(`/${locale}/login${qs}`)
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
