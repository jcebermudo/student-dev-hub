"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/profile");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">StudentDevHub</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your hub
          </p>
        </div>
        <Button
          className="w-full gap-2"
          variant="outline"
          onClick={signInWithGoogle}
        >
          <FaGoogle className="h-4 w-4" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
