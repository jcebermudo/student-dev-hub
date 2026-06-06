"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HiTrophy, HiSparkles } from "react-icons/hi2"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Match", href: "/jobs", icon: HiSparkles },
  { title: "Hackathons", href: "/hackathons", icon: HiTrophy },
  { title: "Profile", href: "/profile", avatar: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { user, signOut } = useAuth()
  const collapsed = state === "collapsed"
  const profileName = user?.displayName ?? "Profile"
  const profileInitials = profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-4 flex flex-row items-center justify-between">
        {!collapsed && (
          <Image
            src="/images/main-logo.png"
            alt="StudentDevHub"
            width={60}
            height={18}
            className="object-contain ml-2"
          />
        )}
        <SidebarTrigger className={collapsed ? "mx-auto" : ""} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      {item.avatar ? (
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user?.photoURL ?? undefined} alt={profileName} />
                          <AvatarFallback className="text-[8px]">{profileInitials}</AvatarFallback>
                        </Avatar>
                      ) : (
                        item.icon && <item.icon className={pathname === item.href ? "" : "text-muted-foreground"} />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Log out">
              <LogOut className="text-muted-foreground" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
