"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2 } from "lucide-react";

export default function SelectRolePage() {
  const { user, loading, role, setRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && role) {
      // User already has a role, redirect appropriately
      router.replace(role === "seeker" ? "/jobs" : "/employer/dashboard");
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Fuse</h1>
          <p className="text-muted-foreground mt-2">Choose how you want to use the platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Seeker Card */}
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">I&apos;m a Student / Talent</CardTitle>
              <CardDescription>
                Find internships, hackathons, and teammates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>✓ Discover internships & jobs</li>
                <li>✓ Join hackathons</li>
                <li>✓ Find teammates for projects</li>
                <li>✓ Build your credibility score</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setRole("seeker")}
              >
                Continue as Student
              </Button>
            </CardFooter>
          </Card>

          {/* Employer Card */}
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">I&apos;m an Employer</CardTitle>
              <CardDescription>
                Hire talent, host hackathons, and find candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>✓ Post internships & jobs</li>
                <li>✓ Browse verified talent</li>
                <li>✓ Host hackathons</li>
                <li>✓ See credibility scores</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setRole("employer")}
              >
                Continue as Employer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
