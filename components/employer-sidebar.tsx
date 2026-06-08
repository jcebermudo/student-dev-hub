"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, Trophy, BarChart3, LogOut, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
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
} from "@/components/ui/sidebar";

const EMPLOYER_NAV = [
  { title: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { title: "Postings", href: "/employer/postings", icon: Briefcase },
  { title: "Talent Search", href: "/employer/talent", icon: Users },
  { title: "Chat", href: "/employer/chat", icon: MessageCircle },
  { title: "Hackathons", href: "/employer/hackathons", icon: Trophy },
  { title: "Analytics", href: "/employer/analytics", icon: BarChart3 },
];

export function EmployerSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const collapsed = state === "collapsed";
  const companyName = user?.displayName?.split(" ")[0] ?? "Company";
  const initials = companyName.slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-4 flex flex-row items-center justify-between">
        {!collapsed && (
          <Image
            src="/images/main-logo.png"
            alt="Fuse"
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
              {EMPLOYER_NAV.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className={pathname === item.href ? "" : "text-muted-foreground"} />
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
            <SidebarMenuButton tooltip={companyName}>
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback className="text-[8px]">{initials}</AvatarFallback>
              </Avatar>
              {!collapsed && <span>{companyName}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Log out">
              <LogOut className="text-muted-foreground" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
