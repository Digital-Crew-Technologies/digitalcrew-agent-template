import { Suspense } from "react"
import { redirect } from "next/navigation"

import SignUp from "@/features/auth/sign-up"
import { getServerSession } from "@/lib/auth/session"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ returnTo?: string }>
}

export default async function SignUpPage({ params, searchParams }: Props) {
  const { locale } = await params
  const session = await getServerSession()
  if (session) {
    const { returnTo } = await searchParams
    const path =
      returnTo && returnTo.startsWith("/") ? returnTo : "/dashboard"
    redirect(`/${locale}${path}`)
  }

  return (
    <Suspense fallback={null}>
      <SignUp />
    </Suspense>
  )
}
