"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MapPin, Search, Trophy, Users, X } from "lucide-react"
import { FaEthereum, FaGithub, FaGoogle, FaMicrosoft, FaUnity } from "react-icons/fa"
import { SiDevpost } from "react-icons/si"
import type { IconType } from "react-icons"

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
    prize: "PHP 50,000",
    participants: 8002,
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
    prize: "PHP 30,000",
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
    prize: "PHP 80,000",
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
    prize: "PHP 15,000",
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
    prize: "PHP 25,000",
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
    prize: "PHP 20,000",
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

const FILTERS = ["All", "Open", "Upcoming", "Ended", "Online", "In-person"] as const
type HackathonFilter = (typeof FILTERS)[number]

export default function HackathonsPage() {
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)
  const [activeFilter, setActiveFilter] = useState<HackathonFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHackathons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return HACKATHONS.filter((hackathon) => {
      const matchesFilter =
        activeFilter === "All" ||
        hackathon.status === activeFilter ||
        hackathon.location === activeFilter

      const searchableText = [
        hackathon.title,
        hackathon.organizer,
        hackathon.description,
        hackathon.status,
        hackathon.location,
        ...hackathon.tags,
      ]
        .join(" ")
        .toLowerCase()

      return matchesFilter && (!query || searchableText.includes(query))
    })
  }, [activeFilter, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-12">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Hackathons</h1>
          <p className="text-sm text-muted-foreground">Discover and join the best hackathons for student developers.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by title or keyword..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`border px-3 py-1 text-xs font-medium transition-colors ${
                filter === activeFilter
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <Separator />

        {filteredHackathons.length === 0 ? (
          <div className="border border-dashed p-8 text-center">
            <p className="font-medium">No hackathons found</p>
            <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => {
            const Icon = ICONS[hackathon.icon]

            return (
              <Card
                key={hackathon.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedHackathon(hackathon)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedHackathon(hackathon)
                  }
                }}
                className="flex cursor-pointer flex-col overflow-hidden p-0 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className={`relative flex h-36 flex-col items-center justify-center gap-2 ${!hackathon.bannerImage ? `bg-gradient-to-br ${hackathon.bannerFrom} ${hackathon.bannerTo}` : ""}`}>
                  {hackathon.bannerImage ? (
                    <Image src={hackathon.bannerImage} alt={hackathon.title} fill className="object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,white,transparent)]" />
                      {Icon && <Icon className="h-10 w-10 text-white/90" />}
                      <span className="text-xs font-medium tracking-wide text-white/80">{hackathon.organizer}</span>
                    </>
                  )}
                </div>

                <CardContent className="flex-1 space-y-2 px-4 pb-2 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={STATUS_STYLES[hackathon.status]}>{hackathon.status}</Badge>
                    <span className="text-[10px] text-muted-foreground">{hackathon.location}</span>
                  </div>
                  <h2 className="text-sm font-semibold leading-snug">{hackathon.title}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">{hackathon.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {hackathon.participants.toLocaleString()} teams
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {hackathon.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                  <span className="text-sm font-bold">{hackathon.prize}</span>
                  <span className="text-xs text-muted-foreground">{hackathon.timeLeft}</span>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        )}
      </main>

      {selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setSelectedHackathon(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hackathon-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-background shadow-xl ring-1 ring-border"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-48 overflow-hidden">
              {selectedHackathon.bannerImage ? (
                <Image src={selectedHackathon.bannerImage} alt={selectedHackathon.title} fill className="object-cover" />
              ) : (
                <div className={`flex h-full items-center justify-center bg-gradient-to-br ${selectedHackathon.bannerFrom} ${selectedHackathon.bannerTo}`}>
                  {(() => {
                    const Icon = ICONS[selectedHackathon.icon]
                    return Icon ? <Icon className="h-16 w-16 text-white/90" /> : null
                  })()}
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedHackathon(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-background/95 text-foreground shadow-sm transition-colors hover:bg-background"
                aria-label="Close hackathon details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={STATUS_STYLES[selectedHackathon.status]}>{selectedHackathon.status}</Badge>
                  <Badge variant="outline">{selectedHackathon.location}</Badge>
                </div>
                <div>
                  <h2 id="hackathon-title" className="text-xl font-bold">
                    {selectedHackathon.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">Hosted by {selectedHackathon.organizer}</p>
                </div>
                <p className="text-sm leading-relaxed">{selectedHackathon.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border p-3">
                  <Trophy className="mb-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Prize pool</p>
                  <p className="font-semibold">{selectedHackathon.prize}</p>
                </div>
                <div className="border p-3">
                  <Users className="mb-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-semibold">{selectedHackathon.participants.toLocaleString()} teams</p>
                </div>
                <div className="border p-3">
                  <CalendarDays className="mb-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="font-semibold">{selectedHackathon.timeLeft}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {selectedHackathon.location === "Online" ? "Online event" : "In-person event"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedHackathon.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setSelectedHackathon(null)}>
                  Close
                </Button>
                <Button type="button" disabled>
                  Join now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
