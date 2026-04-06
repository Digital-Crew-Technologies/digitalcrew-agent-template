"use client"

import { useId, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, UserIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema } from "@/features/auth/schema/credentials"
import { authClient } from "@/lib/auth/auth-client"
import { localizedAppUrl } from "@/lib/auth/localized-url"
import { Link, useRouter } from "@/lib/i18n/navigation"

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true"

export default function SignUp() {
  const id = useId()
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations("auth.signUp")
  const tCommon = useTranslations("auth.common")

  const returnTo = searchParams.get("returnTo") ?? undefined
  const satelliteRedirect = searchParams.get("redirect") ?? undefined

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitDisabled = loading || !name || !email || !password

  const afterAuthPath = returnTo ?? "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const parsed = signUpSchema.safeParse({ name, email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input")
      return
    }
    setLoading(true)
    try {
      const callbackURL = localizedAppUrl(locale, afterAuthPath)
      const { error: signUpError } = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL,
      })
      if (signUpError) {
        setError(signUpError.message ?? "Sign up failed")
        return
      }
      toast.success(tCommon("redirecting"))
      router.push(afterAuthPath)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    if (!googleEnabled) {
      toast.info(tCommon("googleConnectHint"))
      return
    }
    setLoading(true)
    try {
      const callbackURL = localizedAppUrl(locale, afterAuthPath)
      const { data, error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      })
      if (socialError) {
        setError(socialError.message ?? "Google sign-up failed")
        return
      }
      if (data?.url && data.redirect) {
        window.location.assign(data.url)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <UserIcon className="size-6 stroke-zinc-800 dark:stroke-zinc-100" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>{tCommon("nameLabel")}</Label>
                <Input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tCommon("namePlaceholder")}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>{tCommon("emailLabel")}</Label>
                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tCommon("emailPlaceholder")}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>{tCommon("passwordLabel")}</Label>
                <Input
                  id={`${id}-password`}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tCommon("passwordPlaceholder")}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">{t("passwordHint")}</p>
              </div>
            </div>

            <Button type="submit" disabled={submitDisabled} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground">{tCommon("or")}</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            <>
              <GoogleIcon className="mr-2 h-4 w-4" />
              {tCommon("continueWithGoogle")}
            </>
          </Button>

          <div className="mt-2 text-center text-sm text-muted-foreground">
            {t("haveAccount")}&nbsp;
            <Link
              href={
                satelliteRedirect
                  ? `/login?${new URLSearchParams({
                      ...(returnTo ? { returnTo } : {}),
                      redirect: satelliteRedirect,
                    }).toString()}`
                  : returnTo
                    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
                    : "/login"
              }
              className="text-primary hover:underline"
            >
              {t("signInLink")}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:underline"
          >
            {tCommon("backToHome")}
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
