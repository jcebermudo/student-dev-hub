"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { SidebarLayout } from "@/components/sidebar-layout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && user && role === "employer") {
      router.replace("/employer/dashboard");
    }
    if (!loading && user && !role) {
      router.replace("/select-role");
    }
  }, [user, loading, role, router]);

  if (loading || !user || role !== "seeker") return null;

  return <SidebarLayout>{children}</SidebarLayout>;
}