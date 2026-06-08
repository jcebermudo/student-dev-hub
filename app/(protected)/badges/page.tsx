"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserBadges, AVAILABLE_BADGES, Badge } from "@/lib/badges";
import { BadgeDisplay } from "@/components/badge-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Code2, Flame, Medal } from "lucide-react";

const CATEGORY_ICONS = {
  challenge: Code2,
  hackathon: Trophy,
  skill: Medal,
  milestone: Flame,
};

export default function BadgesPage() {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<{ badge: Badge; earnedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const earnedIds = new Set(earnedBadges.map(b => b.badge.id));

useEffect(() => {
    if (!user) return;
    
    // Capture user outside the async function
    const currentUser = user;
    
    async function loadBadges() {
        const badges = await getUserBadges(currentUser.uid);
        setEarnedBadges(badges);
        setLoading(false);
    }
    
    loadBadges();
}, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Badges</h1>
          <p className="text-sm text-muted-foreground">
            Achievements earned from coding challenges, hackathons, and milestones.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnedBadges.length}</div>
              <p className="text-xs text-muted-foreground">out of {AVAILABLE_BADGES.length} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <Medal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((earnedBadges.length / AVAILABLE_BADGES.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">badge completion rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">keep going!</p>
            </CardContent>
          </Card>
        </div>

        {/* All Badges Grid */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AVAILABLE_BADGES.map((badge) => {
                const earned = earnedIds.has(badge.id);
                const earnedInfo = earnedBadges.find(b => b.badge.id === badge.id);
                return (
                  <Card key={badge.id} className={earned ? "border-emerald-200" : "opacity-60"}>
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="flex justify-center">
                        <BadgeDisplay badge={badge} earnedAt={earnedInfo?.earnedAt} />
                      </div>
                      <p className="font-semibold text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {!earned && (
                        <p className="text-xs text-amber-600">Locked</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="earned" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map(({ badge, earnedAt }) => (
                <Card key={badge.id} className="border-emerald-200">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="flex justify-center">
                      <BadgeDisplay badge={badge} earnedAt={earnedAt} />
                    </div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="locked" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AVAILABLE_BADGES.filter(b => !earnedIds.has(b.id)).map((badge) => (
                <Card key={badge.id} className="opacity-60">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-gray-300" />
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-amber-600">Locked</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}