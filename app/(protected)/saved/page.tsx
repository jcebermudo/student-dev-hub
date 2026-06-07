"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkCheck, Clock, MessageCircle } from "lucide-react"

const SAVED_MATCHES_KEY = "student-dev-hub:saved-matches"

type SavedMatch = {
  id: string
  type: "internship" | "teammate"
  title: string
  subtitle: string
  meta: string
  description: string
  skills: string[]
  savedAt: string
  status: "waiting"
}

const SAMPLE_WAITING: SavedMatch[] = [
  {
    id: "sample-hackathon-team",
    type: "teammate",
    title: "Ana Cruz",
    subtitle: "ML Engineer",
    meta: "ADMU - Research partner",
    description: "Waiting for Ana to confirm if she wants to team up for a social-good AI project.",
    skills: ["Python", "PyTorch", "Data Viz"],
    savedAt: new Date().toISOString(),
    status: "waiting",
  },
]

function formatSavedDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Saved recently"

  return `Saved ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`
}

function getStoredMatches() {
  if (typeof window === "undefined") return []

  try {
    const stored = window.localStorage.getItem(SAVED_MATCHES_KEY)
    return stored ? (JSON.parse(stored) as SavedMatch[]) : []
  } catch {
    return []
  }
}

export default function SavedPage() {
  const [savedMatches, setSavedMatches] = useState<SavedMatch[]>(getStoredMatches)

  const matches = useMemo(() => {
    const ids = new Set(savedMatches.map((match) => match.id))
    return [...savedMatches, ...SAMPLE_WAITING.filter((match) => !ids.has(match.id))]
  }, [savedMatches])

  function removeMatch(id: string) {
    const nextMatches = savedMatches.filter((match) => match.id !== id)
    setSavedMatches(nextMatches)
    window.localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(nextMatches))
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <main className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved</h1>
          <p className="text-sm text-muted-foreground">Right swipes are saved here while you wait for a match or reply.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">pending responses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jobs</CardTitle>
              <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.filter((match) => match.type === "internship").length}</div>
              <p className="text-xs text-muted-foreground">saved opportunities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Teammates</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.filter((match) => match.type === "teammate").length}</div>
              <p className="text-xs text-muted-foreground">team requests</p>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Waiting for Match</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/jobs">Keep swiping</Link>
            </Button>
          </div>

          {matches.length === 0 ? (
            <Card className="items-center p-8 text-center">
              <BookmarkCheck className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">No saved right swipes yet</p>
                <p className="text-sm text-muted-foreground">Swipe right on jobs or teammates to add them here.</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((match) => (
                <Card key={match.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-3">
                    <div>
                      <CardTitle>{match.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{match.subtitle}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700">Waiting</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{match.meta}</p>
                      <p className="text-sm leading-relaxed">{match.description}</p>
                      <p className="text-xs text-muted-foreground">{formatSavedDate(match.savedAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/chat">Message</Link>
                      </Button>
                      {savedMatches.some((savedMatch) => savedMatch.id === match.id) && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeMatch(match.id)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
