"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Code2, Trophy, Zap, Flame, Medal, Award, Star, Brain, Rocket } from "lucide-react";

const ICON_COMPONENTS: Record<string, any> = {
  Code2, Trophy, Zap, Flame, Medal, Award, Star, Brain, Rocket,
};

const COLOR_GRADIENTS: Record<string, string> = {
  gold: "from-yellow-400 to-amber-500",
  silver: "from-gray-300 to-gray-400",
  bronze: "from-amber-600 to-orange-500",
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  green: "from-emerald-400 to-green-600",
  red: "from-red-400 to-rose-500",
  orange: "from-orange-400 to-orange-600",
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
};

export function BadgeDisplay({ badge, earnedAt }: { badge: Badge; earnedAt?: string }) {
  const Icon = ICON_COMPONENTS[badge.icon] || Award;
  const gradient = COLOR_GRADIENTS[badge.color] || COLOR_GRADIENTS.blue;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group relative cursor-pointer">
          <div className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-br shadow-md flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg",
            gradient
          )}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {badge.category === "challenge" && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold text-sm">{badge.name}</p>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
          {earnedAt && (
            <p className="text-xs text-muted-foreground/70">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function BadgeGrid({ badges }: { badges: { badge: Badge; earnedAt: string }[] }) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No badges yet</p>
        <p className="text-xs">Complete coding challenges and join hackathons to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map(({ badge, earnedAt }) => (
        <BadgeDisplay key={badge.id} badge={badge} earnedAt={earnedAt} />
      ))}
    </div>
  );
}