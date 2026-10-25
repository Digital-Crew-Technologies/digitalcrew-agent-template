import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
})

export type AppLocale = (typeof routing.locales)[number]

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  zh: "简体中文",
}
