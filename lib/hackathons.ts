export type HackathonStatus = "Open" | "Upcoming" | "Ended";
export type HackathonLocation = "Online" | "In-person";

export type Hackathon = {
  id: string;
  title: string;
  organizer: string;
  description: string;
  status: HackathonStatus;
  location: HackathonLocation;
  timeLeft: string;
  prize: string;
  participants: number;
  tags: string[];
  bannerFrom: string;
  bannerTo: string;
  icon: string;
  bannerImage?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt?: unknown;
};

export type HackathonFormData = Omit<
  Hackathon,
  "id" | "bannerFrom" | "bannerTo" | "icon" | "createdAt"
>;

export const DEFAULT_HACKATHONS: Hackathon[] = [
  {
    id: "mock-google-vertex-ai",
    title: "Google Vertex AI Hackathon",
    organizer: "Google",
    description: "Build AI-powered solutions that drive positive social impact.",
    status: "Open",
    location: "Online",
    timeLeft: "1 month to go",
    prize: "PHP 50,000",
    participants: 8412,
    tags: ["AI/ML", "Social Impact"],
    bannerFrom: "from-blue-600",
    bannerTo: "to-blue-400",
    icon: "google",
    bannerImage: "/images/google-vertex-ai.webp",
  },
  {
    id: "mock-web3-builders-sprint",
    title: "Web3 Builders Sprint",
    organizer: "Ethereum Foundation",
    description: "Create the next generation of decentralized applications.",
    status: "Open",
    location: "Online",
    timeLeft: "3 weeks to go",
    prize: "PHP 30,000",
    participants: 3201,
    tags: ["Blockchain", "Web3"],
    bannerFrom: "from-violet-700",
    bannerTo: "to-purple-400",
    icon: "ethereum",
    bannerImage: "/images/eth-hp.jpg",
  },
  {
    id: "mock-beyond-tomorrow-summit",
    title: "Beyond Tomorrow Summit",
    organizer: "Microsoft",
    description: "Build intelligent solutions. Solve real-world problems. Create impact that goes Beyond Tomorrow.",
    status: "Open",
    location: "In-person",
    timeLeft: "2 months to go",
    prize: "PHP 80,000",
    participants: 1540,
    tags: ["Climate", "Sustainability"],
    bannerFrom: "from-emerald-600",
    bannerTo: "to-teal-400",
    icon: "microsoft",
    bannerImage: "/images/bt-hp.png",
  },
  {
    id: "mock-open-source-fest",
    title: "Open Source Fest",
    organizer: "GitHub",
    description: "Contribute to open source and win prizes for your impact.",
    status: "Open",
    location: "Online",
    timeLeft: "5 weeks to go",
    prize: "PHP 15,000",
    participants: 5870,
    tags: ["Open Source", "Dev Tools"],
    bannerFrom: "from-zinc-800",
    bannerTo: "to-zinc-600",
    icon: "github",
    bannerImage: "/images/osf-hp.jpg",
  },
  {
    id: "mock-healthtech-hackathon",
    title: "HealthTech Hackathon",
    organizer: "Devpost",
    description: "Design digital health tools that improve patient outcomes.",
    status: "Open",
    location: "In-person",
    timeLeft: "3 months to go",
    prize: "PHP 25,000",
    participants: 920,
    tags: ["Healthcare", "Mobile"],
    bannerFrom: "from-rose-600",
    bannerTo: "to-pink-400",
    icon: "devpost",
    bannerImage: "/images/ht-hp.webp",
  },
  {
    id: "mock-global-game-jam",
    title: "Global Game Jam",
    organizer: "Unity",
    description: "Build a playable game in 30 days using any Unity tools.",
    status: "Open",
    location: "Online",
    timeLeft: "3 weeks to go",
    prize: "PHP 20,000",
    participants: 11230,
    tags: ["Game Dev", "AR/VR"],
    bannerFrom: "from-orange-600",
    bannerTo: "to-amber-400",
    icon: "unity",
    bannerImage: "/images/unity-hp.webp",
  },
];

export const STATUS_STYLES: Record<HackathonStatus, string> = {
  Open: "bg-emerald-100 text-emerald-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Ended: "bg-muted text-muted-foreground",
};

export function normalizeHackathon(id: string, data: Record<string, unknown>): Hackathon {
  return {
    id,
    title: String(data.title ?? "Untitled Hackathon"),
    organizer: String(data.organizer ?? "Unknown organizer"),
    description: String(data.description ?? ""),
    status: isHackathonStatus(data.status) ? data.status : "Open",
    location: isHackathonLocation(data.location) ? data.location : "Online",
    timeLeft: String(data.timeLeft ?? "Timeline TBD"),
    prize: String(data.prize ?? "Prize TBD"),
    participants: typeof data.participants === "number" ? data.participants : 0,
    tags: Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [],
    bannerFrom: String(data.bannerFrom ?? "from-slate-700"),
    bannerTo: String(data.bannerTo ?? "to-slate-500"),
    icon: String(data.icon ?? "trophy"),
    bannerImage: typeof data.bannerImage === "string" ? data.bannerImage : undefined,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : undefined,
    createdByName: typeof data.createdByName === "string" ? data.createdByName : undefined,
    createdAt: data.createdAt,
  };
}

export function mergeHackathons(databaseHackathons: Hackathon[]): Hackathon[] {
  const seen = new Set<string>();

  return [...databaseHackathons, ...DEFAULT_HACKATHONS].filter((hackathon) => {
    const key = getHackathonKey(hackathon);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getHackathonKey(hackathon: Hackathon) {
  return `${hackathon.title.trim().toLowerCase()}::${hackathon.organizer
    .trim()
    .toLowerCase()}`;
}

function isHackathonStatus(value: unknown): value is HackathonStatus {
  return value === "Open" || value === "Upcoming" || value === "Ended";
}

function isHackathonLocation(value: unknown): value is HackathonLocation {
  return value === "Online" || value === "In-person";
}
