"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Clock, Star, Trophy, Zap } from "lucide-react";
import { checkAndAwardBadges } from "@/lib/badges";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  points: number;
  completed: boolean;
  completedAt?: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Two Sum Problem",
    description: "Find two numbers that add up to a target value.",
    difficulty: "Easy",
    category: "Algorithms",
    points: 100,
    completed: false,
  },
  {
    id: 2,
    title: "Binary Tree Traversal",
    description: "Implement inorder, preorder, and postorder traversal.",
    difficulty: "Medium",
    category: "Data Structures",
    points: 200,
    completed: false,
  },
  {
    id: 3,
    title: "REST API Design",
    description: "Design a RESTful API for a task management system.",
    difficulty: "Medium",
    category: "System Design",
    points: 250,
    completed: false,
  },
  {
    id: 4,
    title: "Database Optimization",
    description: "Optimize slow queries and add proper indexes.",
    difficulty: "Hard",
    category: "Databases",
    points: 350,
    completed: false,
  },
  {
    id: 5,
    title: "React Performance",
    description: "Optimize a React app using memoization and code splitting.",
    difficulty: "Medium",
    category: "Frontend",
    points: 200,
    completed: false,
  },
  {
    id: 6,
    title: "Palindrome Checker",
    description: "Check if a string is a palindrome.",
    difficulty: "Easy",
    category: "Algorithms",
    points: 100,
    completed: false,
  },
  {
    id: 7,
    title: "Merge Sort Implementation",
    description: "Implement the merge sort algorithm.",
    difficulty: "Medium",
    category: "Algorithms",
    points: 200,
    completed: false,
  },
  {
    id: 8,
    title: "Docker Containerization",
    description: "Create a Dockerfile and docker-compose for a Node.js app.",
    difficulty: "Medium",
    category: "DevOps",
    points: 250,
    completed: false,
  },
];

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0);
  const maxPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const completionRate = Math.round((completedCount / challenges.length) * 100);

  const handleStartChallenge = async (id: number) => {
    // For demo, mark as complete
    const updatedChallenges = challenges.map(c => 
      c.id === id ? { ...c, completed: true, completedAt: new Date().toISOString().split("T")[0] } : c
    );
    setChallenges(updatedChallenges);
    
    // Check for new badges
    if (user) {
      const completedCount = updatedChallenges.filter(c => c.completed).length;
      const newlyEarned = await checkAndAwardBadges(user.uid, {
        challenges_completed: completedCount,
      });
      
      if (newlyEarned.length > 0) {
        setCompletionMessage(`🎉 Congrats! You earned ${newlyEarned.length} new badge(s)!`);
        setTimeout(() => setCompletionMessage(null), 5000);
      } else {
        setCompletionMessage("✅ Challenge completed! Keep going!");
        setTimeout(() => setCompletionMessage(null), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coding Challenges</h1>
          <p className="text-sm text-muted-foreground">
            Complete challenges to earn badges and boost your credibility score.
          </p>
        </div>

        {completionMessage && (
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-md text-center text-sm">
            {completionMessage}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}/{challenges.length}</div>
              <p className="text-xs text-muted-foreground">{completionRate}% completion</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}/{maxPoints}</div>
              <p className="text-xs text-muted-foreground">credibility points</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">🔥 Keep it going!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(completedCount / 3)}
              </div>
              <p className="text-xs text-muted-foreground">from challenges</p>
            </CardContent>
          </Card>
        </div>

        {/* Challenges List */}
        <div className="space-y-3">
          <h2 className="font-semibold">Available Challenges</h2>
          {challenges.map((challenge) => (
            <Card key={challenge.id} className={challenge.completed ? "border-emerald-200 bg-emerald-50/30" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <Badge className={DIFFICULTY_COLORS[challenge.difficulty]}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Code2 className="h-3 w-3" />
                    {challenge.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {challenge.points} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    30 min
                  </span>
                  {challenge.completed && challenge.completedAt && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Trophy className="h-3 w-3" />
                      Completed on {new Date(challenge.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {challenge.completed ? (
                  <Button disabled variant="outline" className="w-full">
                    <Trophy className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                ) : (
                  <Button onClick={() => handleStartChallenge(challenge.id)} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Challenge
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}