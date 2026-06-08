import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs } from "firebase/firestore";

export type BadgeCategory = "challenge" | "hackathon" | "skill" | "milestone";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  requirement: string;
  requirementValue: number;
};

export type UserBadge = {
  badgeId: string;
  earnedAt: string;
  progress?: number;
};

// All available badges
export const AVAILABLE_BADGES: Badge[] = [
  // Coding Challenge Badges
  {
    id: "first-challenge",
    name: "First Step",
    description: "Completed your first coding challenge",
    icon: "Code2",
    color: "blue",
    category: "challenge",
    requirement: "challenges_completed",
    requirementValue: 1,
  },
  {
    id: "challenge-master",
    name: "Challenge Master",
    description: "Completed 10 coding challenges",
    icon: "Zap",
    color: "purple",
    category: "challenge",
    requirement: "challenges_completed",
    requirementValue: 10,
  },
  {
    id: "challenge-legend",
    name: "Legendary Coder",
    description: "Completed 25 coding challenges",
    icon: "Trophy",
    color: "gold",
    category: "challenge",
    requirement: "challenges_completed",
    requirementValue: 25,
  },
  
  // Streak Badges
  {
    id: "streak-7",
    name: "Weekly Warrior",
    description: "Maintained a 7-day coding streak",
    icon: "Flame",
    color: "orange",
    category: "milestone",
    requirement: "current_streak",
    requirementValue: 7,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintained a 30-day coding streak",
    icon: "Flame",
    color: "red",
    category: "milestone",
    requirement: "current_streak",
    requirementValue: 30,
  },
  
  // Skill Badges
  {
    id: "react-expert",
    name: "React Expert",
    description: "Completed all React challenges",
    icon: "Code2",
    color: "blue",
    category: "skill",
    requirement: "skill_react",
    requirementValue: 100,
  },
  {
    id: "python-master",
    name: "Python Master",
    description: "Completed all Python challenges",
    icon: "Code2",
    color: "green",
    category: "skill",
    requirement: "skill_python",
    requirementValue: 100,
  },
  
  // Hackathon Badges
  {
    id: "first-hackathon",
    name: "Hackathon Rookie",
    description: "Participated in your first hackathon",
    icon: "Trophy",
    color: "bronze",
    category: "hackathon",
    requirement: "hackathons_joined",
    requirementValue: 1,
  },
  {
    id: "hackathon-veteran",
    name: "Hackathon Veteran",
    description: "Participated in 5 hackathons",
    icon: "Medal",
    color: "silver",
    category: "hackathon",
    requirement: "hackathons_joined",
    requirementValue: 5,
  },
];

// Badge icon mapping (for Lucide icons)
export const BADGE_ICON_MAP: Record<string, string> = {
  Code2: "Code2",
  Zap: "Zap",
  Trophy: "Trophy",
  Flame: "Flame",
  Medal: "Medal",
  Award: "Award",
  Star: "Star",
  Brain: "Brain",
  Rocket: "Rocket",
};

// Badge color mapping
export const BADGE_COLOR_MAP: Record<string, string> = {
  gold: "from-yellow-400 to-amber-500",
  silver: "from-gray-300 to-gray-400",
  bronze: "from-amber-600 to-orange-500",
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  green: "from-emerald-400 to-green-600",
  red: "from-red-400 to-rose-500",
  orange: "from-orange-400 to-orange-600",
};

// Check and award badges based on user stats
export async function checkAndAwardBadges(userId: string, userStats: {
  challenges_completed?: number;
  current_streak?: number;
  total_points?: number;
  hackathons_joined?: number;
  skill_react?: number;
  skill_python?: number;
  skill_typescript?: number;
  skill_go?: number;
}) {
  const userBadgesRef = doc(db, "users", userId, "badges", "earned");
  const userBadgesDoc = await getDoc(userBadgesRef);
  const earnedBadgeIds = new Set(userBadgesDoc.exists() ? userBadgesDoc.data()?.badgeIds || [] : []);
  
  const newlyEarned: Badge[] = [];
  
  for (const badge of AVAILABLE_BADGES) {
    if (earnedBadgeIds.has(badge.id)) continue;
    
    let earned = false;
    
    switch (badge.requirement) {
      case "challenges_completed":
        if ((userStats.challenges_completed || 0) >= badge.requirementValue) earned = true;
        break;
      case "current_streak":
        if ((userStats.current_streak || 0) >= badge.requirementValue) earned = true;
        break;
      case "skill_react":
        if ((userStats.skill_react || 0) >= badge.requirementValue) earned = true;
        break;
      case "skill_python":
        if ((userStats.skill_python || 0) >= badge.requirementValue) earned = true;
        break;
      case "hackathons_joined":
        if ((userStats.hackathons_joined || 0) >= badge.requirementValue) earned = true;
        break;
    }
    
    if (earned) {
      newlyEarned.push(badge);
      earnedBadgeIds.add(badge.id);
    }
  }
  
  if (newlyEarned.length > 0) {
    await setDoc(userBadgesRef, {
      badgeIds: Array.from(earnedBadgeIds),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    
    // Also store individual badge docs for tracking
    for (const badge of newlyEarned) {
      await setDoc(doc(db, "users", userId, "badges", badge.id), {
        badgeId: badge.id,
        earnedAt: new Date().toISOString(),
        badgeData: badge,
      });
    }
  }
  
  return newlyEarned;
}

// Get all earned badges for a user
export async function getUserBadges(userId: string): Promise<{ badge: Badge; earnedAt: string }[]> {
  const badgesRef = collection(db, "users", userId, "badges");
  const snapshot = await getDocs(badgesRef);
  
  const result: { badge: Badge; earnedAt: string }[] = [];
  
  for (const doc of snapshot.docs) {
    if (doc.id === "earned") continue;
    
    const data = doc.data();
    const badge = AVAILABLE_BADGES.find(b => b.id === doc.id);
    if (badge) {
      result.push({
        badge,
        earnedAt: data.earnedAt || "Unknown",
      });
    }
  }
  
  return result;
}