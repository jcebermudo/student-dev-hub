"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_TALENT } from "@/lib/talent";
import { cn } from "@/lib/utils";
import { Search, Send } from "lucide-react";

type Message = {
  from: "employer" | "talent";
  text: string;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  label: string;
  subject: string;
  preview: string;
  time: string;
  unread: number;
  image: string;
  messages: Message[];
};

const CONVERSATIONS: Conversation[] = MOCK_TALENT.map((person, index) => ({
  id: String(person.id),
  name: person.name,
  role: `${person.role} / ${person.school}`,
  label: index % 2 === 0 ? "Talent" : "Candidate",
  subject: person.looking,
  preview:
    index % 2 === 0
      ? "Thanks for reaching out. I can send over my portfolio."
      : "Happy to talk about the role and team.",
  time: ["10:42 AM", "Yesterday", "Mon", "Fri", "Jun 2", "May 29"][index] ?? "Today",
  unread: index === 0 ? 2 : index === 2 ? 1 : 0,
  image: person.image,
  messages: [
    {
      from: "employer",
      text: `Hi ${person.name.split(" ")[0]}, your ${person.role.toLowerCase()} profile stood out in Talent Search.`,
    },
    {
      from: "talent",
      text: "Thanks for reaching out. I can share more about my projects and availability.",
    },
    {
      from: "employer",
      text: `Great. We are looking for someone with ${person.skills.slice(0, 2).join(" and ")} experience.`,
    },
    {
      from: "talent",
      text:
        index % 2 === 0
          ? "That lines up with my recent work. I can send over my portfolio."
          : "Happy to talk about the role and team.",
    },
  ],
}));

export default function EmployerChatPage() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return CONVERSATIONS;
    }

    return CONVERSATIONS.filter((conversation) =>
      [
        conversation.name,
        conversation.role,
        conversation.label,
        conversation.subject,
        conversation.preview,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query]);

  const active = CONVERSATIONS.find((conversation) => conversation.id === activeId) ?? CONVERSATIONS[0];
  const messages = [
    ...active.messages,
    ...(sentMessages[active.id] ?? []).map((text) => ({ from: "employer" as const, text })),
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <main className="mx-auto flex h-[calc(100vh-3rem)] max-w-6xl flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
          <p className="text-sm text-muted-foreground">Contact candidates, follow up with talent, and keep hiring conversations in one place.</p>
        </div>

        <Card className="grid min-h-0 flex-1 gap-0 p-0 md:grid-cols-[340px_1fr]">
          <aside className="min-h-0 border-b md:border-b-0 md:border-r">
            <div className="space-y-3 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search talent chats..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto md:max-h-[calc(100vh-12rem)]">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  className={cn(
                    "flex w-full gap-3 border-t px-4 py-3 text-left transition-colors hover:bg-muted/60",
                    activeId === conversation.id && "bg-muted"
                  )}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={conversation.image} alt={conversation.name} fill className="object-cover" />
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

              {filteredConversations.length === 0 && (
                <div className="border-t p-6 text-center">
                  <p className="text-sm font-medium">No chats found</p>
                  <p className="text-xs text-muted-foreground">Try another candidate, role, or skill.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 border-b p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={active.image} alt={active.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{active.name}</h2>
                  <p className="truncate text-sm text-muted-foreground">{active.role}</p>
                </div>
              </div>
              <Badge variant="outline">{active.subject}</Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={`${active.id}-${index}`}
                  className={cn("flex", message.from === "employer" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                      message.from === "employer"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
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
                event.preventDefault();
                const text = draft.trim();
                if (!text) return;
                setSentMessages((current) => ({
                  ...current,
                  [active.id]: [...(current[active.id] ?? []), text],
                }));
                setDraft("");
              }}
            >
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Message ${active.name.split(" ")[0]}...`}
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </section>
        </Card>
      </main>
    </div>
  );
}
