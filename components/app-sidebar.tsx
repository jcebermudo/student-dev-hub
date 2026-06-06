"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HiTrophy, HiSparkles } from "react-icons/hi2"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Sidebar,
  SidebarContent,
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
  { title: "Profile", href: "/", avatar: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

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
                          <AvatarImage src="/images/people/nico-reyes.jpg" alt="Profile" />
                          <AvatarFallback className="text-[8px]">NR</AvatarFallback>
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
    </Sidebar>
  )
}
