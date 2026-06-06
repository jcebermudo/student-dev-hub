"use client"

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform, useMotionValueEvent, animate } from "motion/react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { X, Heart, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Types ---
type InternshipCard = {
  type: "internship"
  id: number
  company: string
  role: string
  location: string
  description: string
  skills: string[]
  color: string
  initials: string
  logo?: string
}

type TeammateCard = {
  type: "teammate"
  id: number
  name: string
  school: string
  role: string
  bio: string
  skills: string[]
  color: string
  initials: string
  looking: string
  image: string
}

type AnyCard = InternshipCard | TeammateCard

// --- Data ---
const INTERNSHIPS: InternshipCard[] = [
  {
    type: "internship",
    id: 1,
    company: "Grab",
    role: "Backend Engineering Intern",
    location: "Makati, PH",
    description: "Work on core ride-matching algorithms serving millions of daily users across Southeast Asia.",
    skills: ["Go", "Python", "Kubernetes"],
    color: "bg-green-500",
    initials: "G",
    logo: "/images/companies/grab.svg",
  },
  {
    type: "internship",
    id: 2,
    company: "Shopee",
    role: "Frontend Intern",
    location: "Manila, PH",
    description: "Build high-performance e-commerce UIs used by 200M+ shoppers in the region.",
    skills: ["React", "TypeScript", "Next.js"],
    color: "bg-orange-500",
    initials: "S",
    logo: "/images/companies/shopee.png",
  },
  {
    type: "internship",
    id: 3,
    company: "Accenture Philippines",
    role: "Full Stack Intern",
    location: "BGC, Taguig",
    description: "Develop enterprise solutions for Fortune 500 clients across Southeast Asia.",
    skills: ["Node.js", "React", "AWS"],
    color: "bg-purple-600",
    initials: "A",
    logo: "/images/companies/accenture.png",
  },
  {
    type: "internship",
    id: 4,
    company: "Maya",
    role: "Mobile Engineering Intern",
    location: "Makati, PH",
    description: "Help build the fastest-growing digital bank app in the Philippines.",
    skills: ["Flutter", "Dart", "Firebase"],
    color: "bg-blue-500",
    initials: "M",
  },
  {
    type: "internship",
    id: 5,
    company: "UnionBank",
    role: "AI / ML Intern",
    location: "Pasig, PH",
    description: "Research and deploy ML models for fraud detection and credit scoring at scale.",
    skills: ["Python", "TensorFlow", "MLOps"],
    color: "bg-red-600",
    initials: "UB",
  },
  {
    type: "internship",
    id: 6,
    company: "Globe Telecom",
    role: "Cloud Engineering Intern",
    location: "Mandaluyong, PH",
    description: "Manage cloud infrastructure for a network serving 80M+ subscribers nationwide.",
    skills: ["AWS", "Docker", "Terraform"],
    color: "bg-sky-500",
    initials: "GL",
  },
]

const TEAMMATES: TeammateCard[] = [
  {
    type: "teammate",
    id: 101,
    name: "Maria Santos",
    school: "DLSU",
    role: "Frontend Developer",
    bio: "Passionate about accessible UIs and design systems. Looking for a hackathon team.",
    skills: ["React", "Figma", "TypeScript"],
    color: "bg-pink-500",
    initials: "MS",
    looking: "Hackathon teammate",
    image: "/images/people/maria-santos.jpg",
  },
  {
    type: "teammate",
    id: 102,
    name: "Juan Reyes",
    school: "UP Diliman",
    role: "Backend Developer",
    bio: "Systems nerd who loves distributed systems. Seeking a co-founder for a fintech startup.",
    skills: ["Go", "PostgreSQL", "Docker"],
    color: "bg-indigo-500",
    initials: "JR",
    looking: "Startup co-founder",
    image: "/images/people/juan-reyes.jpg",
  },
  {
    type: "teammate",
    id: 103,
    name: "Ana Cruz",
    school: "ADMU",
    role: "ML Engineer",
    bio: "Research assistant at the AI Lab. Looking to apply ML in social good projects.",
    skills: ["Python", "PyTorch", "Data Viz"],
    color: "bg-emerald-500",
    initials: "AC",
    looking: "Research partner",
    image: "/images/people/ana-cruz.jpg",
  },
  {
    type: "teammate",
    id: 104,
    name: "Miguel Lim",
    school: "UST",
    role: "iOS Developer",
    bio: "Building AR experiences since freshman year. Looking for hackathon teams in spatial computing.",
    skills: ["Swift", "ARKit", "Xcode"],
    color: "bg-orange-500",
    initials: "ML",
    looking: "Hackathon teammate",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    type: "teammate",
    id: 105,
    name: "Sofia Dela Rosa",
    school: "DLSU",
    role: "Product Manager",
    bio: "Bridge between design and engineering. Looking for a technical co-founder for EdTech.",
    skills: ["Figma", "Notion", "SQL"],
    color: "bg-violet-500",
    initials: "SD",
    looking: "Startup co-founder",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
  },
  {
    type: "teammate",
    id: 106,
    name: "Paolo Garcia",
    school: "MAPUA",
    role: "DevOps Engineer",
    bio: "I love automating everything. Happy to join any team that needs solid infrastructure.",
    skills: ["AWS", "Kubernetes", "CI/CD"],
    color: "bg-teal-500",
    initials: "PG",
    looking: "Any team",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
  },
]

// --- SwipeCard ---
type SwipeCardHandle = { swipe: (dir: "left" | "right") => void }
type SwipeCardProps = { card: AnyCard; stackIndex: number; onDone: (dir: "left" | "right") => void; onSwipeDir?: (dir: "left" | "right" | null) => void }

const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(({ card, stackIndex, onDone, onSwipeDir }, ref) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const rotateY = useTransform(x, [-300, 0, 300], [35, 0, -35])
  const likeOpacity = useTransform(x, [30, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0])
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null)
  const bounceScale = useMotionValue(1 - stackIndex * 0.04)
  const bounceY = useMotionValue(stackIndex * 12)
  const prevStackIndex = useRef(stackIndex)

  useEffect(() => {
    if (prevStackIndex.current !== 0 && stackIndex === 0) {
      animate(bounceScale, [0.96, 1.06, 0.98, 1], { duration: 0.5, ease: "easeOut" })
      animate(bounceY, [12, -8, 2, 0], { duration: 0.5, ease: "easeOut" })
    } else {
      bounceScale.set(1 - stackIndex * 0.04)
      bounceY.set(stackIndex * 12)
    }
    prevStackIndex.current = stackIndex
  }, [stackIndex])

  useMotionValueEvent(x, "change", (latest) => {
    const dir = latest > 20 ? "right" : latest < -20 ? "left" : null
    setSwipeDir(dir)
    onSwipeDir?.(dir)
  })

  const swipe = (dir: "left" | "right") => {
    animate(x, dir === "right" ? 600 : -600, { duration: 0.25 }).then(() => onDone(dir))
  }

  useImperativeHandle(ref, () => ({ swipe }))

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 80) swipe("right")
    else if (info.offset.x < -80) swipe("left")
    else animate(x, 0, { duration: 0.3 })
  }

  if (stackIndex > 2) return null

  return (
    <motion.div
      style={{
        x: stackIndex === 0 ? x : 0,
        rotate: stackIndex === 0 ? rotate : 0,
        rotateY: stackIndex === 0 ? rotateY : 0,
        transformPerspective: 900,
        scale: bounceScale,
        y: bounceY,
        position: "absolute",
        width: "100%",
        zIndex: 10 - stackIndex,
      }}
      drag={stackIndex === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={stackIndex === 0 ? handleDragEnd : undefined}
      className={stackIndex === 0 ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}
    >
      {stackIndex === 0 && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className={cn(
              "absolute top-5 left-5 z-10 border-2 rounded px-2 py-0.5 text-xs font-bold tracking-widest -rotate-12 select-none",
              card.type === "teammate" && swipeDir === "right" ? "border-white text-white" : "border-emerald-500 text-emerald-500"
            )}
          >
            LIKE
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className={cn(
              "absolute top-5 right-5 z-10 border-2 rounded px-2 py-0.5 text-xs font-bold tracking-widest rotate-12 select-none",
              card.type === "teammate" && swipeDir === "left" ? "border-white text-white" : "border-red-500 text-red-500"
            )}
          >
            NOPE
          </motion.div>
        </>
      )}

      <Card className={cn(
        "overflow-hidden h-[360px] flex flex-col select-none p-0 transition-colors duration-75",
        swipeDir === "left" && "bg-red-500",
        swipeDir === "right" && "bg-green-500",
      )}>
        {/* Internship banner / Teammate avatar layout */}
        {card.type === "internship" ? (
          <>
            <div className={cn("h-44 shrink-0 flex flex-col items-center justify-center gap-2", card.logo ? "bg-white" : card.color)}>
              {card.logo ? (
                <Image src={card.logo} alt={card.company} width={120} height={60} className="object-contain" />
              ) : (
                <>
                  <div className="h-16 w-16 flex items-center justify-center text-white text-xl font-bold bg-white/20 rounded-xl">
                    {card.initials}
                  </div>
                  <span className="text-white/80 text-sm font-medium">{card.company}</span>
                </>
              )}
            </div>
            <div className={cn("p-3 flex flex-col gap-1.5 flex-1", swipeDir ? "text-white" : "text-foreground")}>
              <div>
                <h2 className="font-semibold leading-tight">{card.role}</h2>
                <p className={cn("text-xs flex items-center gap-1 mt-0.5", swipeDir ? "text-white/80" : "text-muted-foreground")}>
                  <MapPin className="h-3 w-3 shrink-0" /> {card.location}
                </p>
              </div>
              <p className={cn("text-sm leading-relaxed", swipeDir ? "text-white/80" : "text-muted-foreground")}>{card.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {card.skills.map((s) => (
                  <Badge key={s} variant={swipeDir ? "outline" : "secondary"} className={cn("text-[11px] font-normal", swipeDir && "border-white/40 text-white bg-white/10")}>{s}</Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={cn("flex flex-col items-center p-5 gap-3 flex-1", swipeDir ? "text-white" : "text-foreground")}>
            {/* Circular avatar */}
            <div className="relative h-24 w-24 rounded-full overflow-hidden shrink-0 mt-2">
              <Image src={card.image} alt={card.name} fill className="object-cover" />
            </div>
            {/* Name + school */}
            <div className="text-center">
              <h2 className="font-bold text-lg leading-tight">{card.name}</h2>
              <p className={cn("text-sm mt-0.5", swipeDir ? "text-white/80" : "text-muted-foreground")}>{card.school}</p>
            </div>
            {/* Bio */}
            <p className={cn("text-sm text-center leading-relaxed", swipeDir ? "text-white/80" : "text-muted-foreground")}>{card.bio}</p>
            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-auto pb-1">
              {card.skills.map((s) => (
                <Badge key={s} variant={swipeDir ? "outline" : "secondary"} className={cn("text-[11px] font-normal", swipeDir && "border-white/40 text-white bg-white/10")}>{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
})
SwipeCard.displayName = "SwipeCard"

// --- Page ---
export default function MatchPage() {
  const [tab, setTab] = useState<"internships" | "teammates">("internships")
  const [internshipIndex, setInternshipIndex] = useState(0)
  const [teammateIndex, setTeammateIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null)
  const topCardRef = useRef<SwipeCardHandle>(null)

  const data = tab === "internships" ? INTERNSHIPS : TEAMMATES
  const currentIndex = tab === "internships" ? internshipIndex : teammateIndex

  const handleDone = () => {
    if (tab === "internships") setInternshipIndex((i) => i + 1)
    else setTeammateIndex((i) => i + 1)
    setTimeout(() => setSwipeDir(null), 100)
  }

  const triggerSwipe = (dir: "left" | "right") => {
    topCardRef.current?.swipe(dir)
  }

  const visibleData = data.slice(currentIndex, currentIndex + 3)
  const done = currentIndex >= data.length

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <main className="flex flex-col items-center px-4 py-10 gap-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Match</h1>
          <p className="text-sm text-muted-foreground">Swipe to find your next opportunity or teammate.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border border-border p-1">
          {(["internships", "teammates"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium transition-all",
                tab === t ? "bg-black text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Card stack */}
        <div className="relative w-80 h-[380px]">
          {done ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg">
              <p className="font-medium text-sm">You&apos;re all caught up!</p>
              <p className="text-xs text-muted-foreground">Check back later for more {tab}.</p>
            </div>
          ) : (
            [...visibleData].reverse().map((card, i) => {
              const stackIndex = visibleData.length - 1 - i
              const isTop = stackIndex === 0
              return (
                <SwipeCard
                  key={card.id}
                  ref={isTop ? topCardRef : null}
                  card={card}
                  stackIndex={stackIndex}
                  onDone={handleDone}
                  onSwipeDir={isTop ? setSwipeDir : undefined}
                />
              )
            })
          )}
        </div>

        {/* Buttons */}
        {!done && (
          <div className="flex items-center gap-8">
            <motion.button
              onClick={() => triggerSwipe("left")}
              animate={swipeDir === "left" ? { scale: 1.25 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "h-14 w-14 rounded-full border-2 flex items-center justify-center transition-colors",
                swipeDir === "left"
                  ? "bg-red-500 border-red-500"
                  : "border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400"
              )}
            >
              <X className={cn("h-6 w-6", swipeDir === "left" ? "text-white" : "")} />
            </motion.button>
            <motion.button
              onClick={() => triggerSwipe("right")}
              animate={swipeDir === "right" ? { scale: 1.25 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "h-14 w-14 rounded-full border-2 flex items-center justify-center transition-colors",
                swipeDir === "right"
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-emerald-200 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-400"
              )}
            >
              <Heart className={cn("h-6 w-6", swipeDir === "right" ? "fill-white text-white" : "")} />
            </motion.button>
          </div>
        )}
      </main>
    </div>
  )
}
