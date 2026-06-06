"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Users, Search } from "lucide-react"
import { FaGoogle, FaEthereum, FaMicrosoft, FaGithub, FaUnity } from "react-icons/fa"
import { SiDevpost } from "react-icons/si"
import type { IconType } from "react-icons"
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const ICONS: Record<string, IconType> = {
  google: FaGoogle,
  ethereum: FaEthereum,
  microsoft: FaMicrosoft,
  github: FaGithub,
  devpost: SiDevpost,
  unity: FaUnity,
}

type Hackathon = {
  id: number
  title: string
  organizer: string
  description: string
  status: "Open" | "Upcoming" | "Ended"
  location: "Online" | "In-person"
  timeLeft: string
  prize: string
  participants: number
  tags: string[]
  bannerFrom: string
  bannerTo: string
  icon: string
  bannerImage?: string
}

const HACKATHONS: Hackathon[] = [
  {
    id: 1,
    title: "Google Vertex AI Hackathon",
    organizer: "Google",
    description: "Build AI-powered solutions that drive positive social impact.",
    status: "Open",
    location: "Online",
    timeLeft: "1 month to go",
    prize: "₱50,000",
    participants: 8412,
    tags: ["AI/ML", "Social Impact"],
    bannerFrom: "from-blue-600",
    bannerTo: "to-blue-400",
    icon: "google",
    bannerImage: "/images/google-vertex-ai.webp",
  },
  {
    id: 2,
    title: "Web3 Builders Sprint",
    organizer: "Ethereum Foundation",
    description: "Create the next generation of decentralized applications.",
    status: "Open",
    location: "Online",
    timeLeft: "3 weeks to go",
    prize: "₱30,000",
    participants: 3201,
    tags: ["Blockchain", "Web3"],
    bannerFrom: "from-violet-700",
    bannerTo: "to-purple-400",
    icon: "ethereum",
    bannerImage: "/images/eth-hp.jpg",
  },
  {
    id: 3,
    title: "Beyond Tomorrow Summit",
    organizer: "Microsoft",
    description: "Build intelligent solutions. Solve real-world problems. Create impact that goes Beyond Tomorrow.",
    status: "Open",
    location: "In-person",
    timeLeft: "2 months to go",
    prize: "₱80,000",
    participants: 1540,
    tags: ["Climate", "Sustainability"],
    bannerFrom: "from-emerald-600",
    bannerTo: "to-teal-400",
    icon: "microsoft",
    bannerImage: "/images/bt-hp.png",
  },
  {
    id: 4,
    title: "Open Source Fest",
    organizer: "GitHub",
    description: "Contribute to open source and win prizes for your impact.",
    status: "Open",
    location: "Online",
    timeLeft: "5 weeks to go",
    prize: "₱15,000",
    participants: 5870,
    tags: ["Open Source", "Dev Tools"],
    bannerFrom: "from-zinc-800",
    bannerTo: "to-zinc-600",
    icon: "github",
    bannerImage: "/images/osf-hp.jpg",
  },
  {
    id: 5,
    title: "HealthTech Hackathon",
    organizer: "Devpost",
    description: "Design digital health tools that improve patient outcomes.",
    status: "Open",
    location: "In-person",
    timeLeft: "3 months to go",
    prize: "₱25,000",
    participants: 920,
    tags: ["Healthcare", "Mobile"],
    bannerFrom: "from-rose-600",
    bannerTo: "to-pink-400",
    icon: "devpost",
    bannerImage: "/images/ht-hp.webp",
  },
  {
    id: 6,
    title: "Global Game Jam",
    organizer: "Unity",
    description: "Build a playable game in 30 days using any Unity tools.",
    status: "Open",
    location: "Online",
    timeLeft: "3 weeks to go",
    prize: "₱20,000",
    participants: 11230,
    tags: ["Game Dev", "AR/VR"],
    bannerFrom: "from-orange-600",
    bannerTo: "to-amber-400",
    icon: "unity",
    bannerImage: "/images/unity-hp.webp",
  },
]

const STATUS_STYLES: Record<Hackathon["status"], string> = {
  Open: "bg-emerald-100 text-emerald-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Ended: "bg-muted text-muted-foreground",
}

async function seedHackathons() {
  for (const hackathon of HACKATHONS) {
    await setDoc(
      doc(collection(db, "hackathons"), String(hackathon.id)),
      {
        ...hackathon,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }
}

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Hackathons</h1>
          <p className="text-sm text-muted-foreground">Discover and join the best hackathons for student developers.</p>
          
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title or keyword..." />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {["All", "Open", "Upcoming", "Ended", "Online", "In-person"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 text-xs font-medium border transition-colors
                ${f === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Separator />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HACKATHONS.map((h) => {
            const Icon = ICONS[h.icon]

            return (
            <Card key={h.id} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden p-0">

              {/* Banner */}
              <div className={`relative h-36 ${!h.bannerImage ? `bg-gradient-to-br ${h.bannerFrom} ${h.bannerTo}` : ""} flex flex-col items-center justify-center gap-2`}>
                {h.bannerImage ? (
                  <Image src={h.bannerImage} alt={h.title} fill className="object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,white,transparent)]" />
                    {Icon && <Icon className="h-10 w-10 text-white/90" />}
                    <span className="text-white/80 text-xs font-medium tracking-wide">{h.organizer}</span>
                  </>
                )}
              </div>

              {/* Body */}
              <CardContent className="flex-1 px-4 pt-2 pb-2 space-y-2">
                <h2 className="font-semibold text-sm leading-snug">{h.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{h.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {h.participants.toLocaleString()} Teams
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {h.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
                <span className="font-bold text-sm">{h.prize}</span>
                <span className="text-xs text-muted-foreground">{h.timeLeft}</span>
              </CardFooter>

            </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
