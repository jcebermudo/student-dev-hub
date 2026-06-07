"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Trophy, TrendingUp } from "lucide-react";

// TODO: Replace with real data from Firestore
const MOCK_STATS = {
  totalApplicants: 847,
  openPositions: 12,
  activeHackathons: 3,
  avgCredibilityScore: 78,
};

export default function EmployerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <p className="text-muted-foreground">Manage your talent pipeline and hackathons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">across all postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.openPositions}</div>
            <p className="text-xs text-muted-foreground">active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Hackathons</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.activeHackathons}</div>
            <p className="text-xs text-muted-foreground">hosted by you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Credibility</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.avgCredibilityScore}%</div>
            <p className="text-xs text-muted-foreground">of applicants</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
            + Post New Job
          </button>
          <button className="px-4 py-2 border rounded-md text-sm">
            + Create Hackathon
          </button>
          <button className="px-4 py-2 border rounded-md text-sm">
            Browse Talent
          </button>
        </CardContent>
      </Card>
    </div>
  );
}