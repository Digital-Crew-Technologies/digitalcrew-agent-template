"use client"

import { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth/auth-client"
import { Link, useRouter } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

type ProfileDropdownProps = {
  /** Use "sidebar" when rendering in the app sidebar footer. */
  variant?: "default" | "sidebar"
}

function getInitials(input: { fullName: string; email: string }) {
  const { fullName, email } = input

  if (fullName) {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return fullName[0]?.toUpperCase() || "U"
  }

  if (email) return email[0]?.toUpperCase() || "U"
  return "U"
}

export function ProfileDropdown({ variant = "default" }: ProfileDropdownProps) {
  useLocale()

  const tNav = useTranslations("nav")
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const vm = useMemo(() => {
    const user = session?.user
    const fullName = user?.name ?? ""
    const email = user?.email ?? ""
    const displayName = fullName || tNav("myAccount")
    const avatarUrl = user?.image ?? "/avatars/01.png"
    const initials = getInitials({ fullName, email })
    return { displayName, email, avatarUrl, initials }
  }, [session?.user, tNav])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  const dropdownContent = (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm leading-none font-medium">{vm.displayName}</p>
          {vm.email && (
            <p className="text-xs leading-none text-muted-foreground">
              {vm.email}
            </p>
          )}
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span>{tNav("dashboard")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span>{tNav("settings")}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        <span>{tNav("logout")}</span>
        <DropdownMenuShortcut className="text-current">⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  )

  if (isPending) {
    const skeleton = (
      <div
        className={cn(
          "flex items-center gap-2",
          variant === "sidebar" && "px-2 py-2",
        )}
      >
        <div className="bg-muted size-8 shrink-0 animate-pulse rounded-full" />
        {variant === "sidebar" && (
          <div className="grid flex-1 gap-1 group-data-[collapsible=icon]:hidden">
            <div className="bg-muted h-3 w-24 animate-pulse rounded" />
            <div className="bg-muted h-3 w-32 animate-pulse rounded" />
          </div>
        )}
      </div>
    )
    if (variant === "sidebar") {
      return <SidebarMenuItem>{skeleton}</SidebarMenuItem>
    }
    return skeleton
  }

  if (variant === "sidebar") {
    return (
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={vm.displayName}
              className={cn(
                "data-[size=lg]:flex data-[size=lg]:items-center data-[size=lg]:gap-3 data-[size=lg]:px-2 data-[size=lg]:py-2",
              )}
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarImage src={vm.avatarUrl} alt={vm.displayName} />
                <AvatarFallback className="rounded-full text-xs">
                  {vm.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 flex-col gap-0.5 overflow-hidden text-left text-sm leading-none group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{vm.displayName}</span>
                {vm.email && (
                  <span className="truncate text-xs text-muted-foreground">
                    {vm.email}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="start"
            side="top"
            sideOffset={4}
            forceMount
          >
            {dropdownContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={vm.avatarUrl} alt={vm.displayName} />
            <AvatarFallback>{vm.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {dropdownContent}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
