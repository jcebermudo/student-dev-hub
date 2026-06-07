"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, Send } from "lucide-react"

const CONVERSATIONS = [
  {
    id: "maria",
    name: "Maria Santos",
    label: "Teammate",
    subject: "Hackathon team",
    preview: "I can handle the UI and pitch deck.",
    time: "10:42 AM",
    unread: 2,
    messages: [
      { from: "them", text: "Hey! Are you still looking for a teammate for the Google Vertex AI Hackathon?" },
      { from: "me", text: "Yes, definitely. I can work on backend and the API setup." },
      { from: "them", text: "Nice. I can handle the UI and pitch deck." },
    ],
  },
  {
    id: "grab",
    name: "Grab Careers",
    label: "Job",
    subject: "Backend Engineering Intern",
    preview: "Thanks for your interest. Send over your latest portfolio when ready.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { from: "them", text: "Thanks for your interest in the Backend Engineering Intern role." },
      { from: "me", text: "Happy to connect. Is the team looking for Go experience?" },
      { from: "them", text: "Go helps, but strong API fundamentals matter most. Send over your latest portfolio when ready." },
    ],
  },
  {
    id: "vertex",
    name: "Vertex AI Hackathon",
    label: "Event",
    subject: "Event inquiry",
    preview: "Submissions close next month, and teams can still edit until then.",
    time: "Mon",
    unread: 0,
    messages: [
      { from: "me", text: "Can we still update our demo after joining?" },
      { from: "them", text: "Yes. Submissions close next month, and teams can still edit until then." },
    ],
  },
]

export default function ChatPage() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [draft, setDraft] = useState("")
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({})
  const active = CONVERSATIONS.find((conversation) => conversation.id === activeId) ?? CONVERSATIONS[0]
  const messages = [
    ...active.messages,
    ...(sentMessages[active.id] ?? []).map((text) => ({ from: "me", text })),
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <main className="mx-auto flex h-[calc(100vh-3rem)] max-w-6xl flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
          <p className="text-sm text-muted-foreground">Message teammates, hackathon organizers, and job contacts.</p>
        </div>

        <Card className="grid min-h-0 flex-1 gap-0 p-0 md:grid-cols-[320px_1fr]">
          <aside className="min-h-0 border-b md:border-b-0 md:border-r">
            <div className="space-y-3 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search chats..." />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto md:max-h-[calc(100vh-12rem)]">
              {CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  className={cn(
                    "flex w-full gap-3 border-t px-4 py-3 text-left transition-colors hover:bg-muted/60",
                    activeId === conversation.id && "bg-muted"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {conversation.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{conversation.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {conversation.label}
                      </Badge>
                      <p className="truncate text-xs text-muted-foreground">{conversation.subject}</p>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{conversation.preview}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="font-semibold">{active.name}</h2>
                <p className="text-sm text-muted-foreground">{active.subject}</p>
              </div>
              <Badge variant="outline">{active.label}</Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={`${active.id}-${index}`} className={cn("flex", message.from === "me" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                      message.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              className="flex gap-2 border-t p-4"
              onSubmit={(event) => {
                event.preventDefault()
                const text = draft.trim()
                if (!text) return
                setSentMessages((current) => ({
                  ...current,
                  [active.id]: [...(current[active.id] ?? []), text],
                }))
                setDraft("")
              }}
            >
              <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message..." />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </section>
        </Card>
      </main>
    </div>
  )
}
