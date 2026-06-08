"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import {
  STATUS_STYLES,
  mergeHackathons,
  normalizeHackathon,
  type Hackathon,
  type HackathonLocation,
  type HackathonStatus,
} from "@/lib/hackathons";
import { CalendarDays, Loader2, MapPin, Pencil, Trophy, Users } from "lucide-react";

type HackathonDraft = {
  title: string;
  organizer: string;
  description: string;
  status: HackathonStatus;
  location: HackathonLocation;
  timeLeft: string;
  prize: string;
  participants: string;
  tags: string;
};

const EMPTY_DRAFT: HackathonDraft = {
  title: "",
  organizer: "",
  description: "",
  status: "Open",
  location: "Online",
  timeLeft: "",
  prize: "",
  participants: "0",
  tags: "",
};

const BANNER_OPTIONS = [
  ["from-blue-600", "to-cyan-400"],
  ["from-emerald-600", "to-teal-400"],
  ["from-rose-600", "to-pink-400"],
  ["from-zinc-800", "to-zinc-600"],
] as const;

export default function EmployerHackathonsPage() {
  const { user } = useAuth();
  const [databaseHackathons, setDatabaseHackathons] = useState<Hackathon[]>([]);
  const [draft, setDraft] = useState<HackathonDraft>(EMPTY_DRAFT);
  const [open, setOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return onSnapshot(collection(db, "hackathons"), (snapshot) => {
      setDatabaseHackathons(
        snapshot.docs.map((doc) => normalizeHackathon(doc.id, doc.data()))
      );
    });
  }, []);

  const hackathons = useMemo(() => mergeHackathons(databaseHackathons), [databaseHackathons]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setError("");

    if (nextOpen && !editingHackathon) {
      setDraft((current) => ({
        ...current,
        organizer: current.organizer || user?.displayName || "",
      }));
    }

    if (!nextOpen) {
      setEditingHackathon(null);
      setDraft({ ...EMPTY_DRAFT, organizer: user?.displayName || "" });
    }
  }

  function handleEdit(hackathon: Hackathon) {
    if (hackathon.createdBy !== user?.uid) {
      setError("Only the creator can edit this hackathon.");
      return;
    }

    setEditingHackathon(hackathon);
    setDraft({
      title: hackathon.title,
      organizer: hackathon.organizer,
      description: hackathon.description,
      status: hackathon.status,
      location: hackathon.location,
      timeLeft: hackathon.timeLeft,
      prize: hackathon.prize,
      participants: String(hackathon.participants),
      tags: hackathon.tags.join(", "),
    });
    setError("");
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!draft.title.trim() || !draft.organizer.trim()) {
      setError("Title and organizer are required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: draft.title.trim(),
        organizer: draft.organizer.trim(),
        description: draft.description.trim() || "Details will be announced soon.",
        status: draft.status,
        location: draft.location,
        timeLeft: draft.timeLeft.trim() || "Timeline TBD",
        prize: draft.prize.trim() || "Prize TBD",
        participants: Number(draft.participants) || 0,
        tags: draft.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingHackathon) {
        if (editingHackathon.createdBy !== user?.uid) {
          setError("Only the creator can edit this hackathon.");
          return;
        }

        await updateDoc(doc(db, "hackathons", editingHackathon.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        const banner = BANNER_OPTIONS[databaseHackathons.length % BANNER_OPTIONS.length];

        await addDoc(collection(db, "hackathons"), {
          ...payload,
          bannerFrom: banner[0],
          bannerTo: banner[1],
          icon: "trophy",
          createdBy: user?.uid ?? null,
          createdByName: user?.displayName ?? null,
          createdAt: serverTimestamp(),
        });
      }

      setDraft({ ...EMPTY_DRAFT, organizer: user?.displayName || "" });
      setEditingHackathon(null);
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create hackathon.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hackathons</h1>
          <p className="text-muted-foreground">Track hosted and sponsored hackathons.</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Trophy className="h-4 w-4" />
              Create Hackathon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingHackathon ? "Edit hackathon" : "Create hackathon"}</DialogTitle>
              <DialogDescription>
                {editingHackathon
                  ? "Only the creator can update this Firestore hackathon."
                  : "New hackathons are saved to Firestore and appear for students and employers."}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <Input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="AI Innovation Sprint"
                    required
                  />
                </Field>
                <Field label="Organizer">
                  <Input
                    value={draft.organizer}
                    onChange={(event) => setDraft({ ...draft, organizer: event.target.value })}
                    placeholder="Company name"
                    required
                  />
                </Field>
              </div>

              <Field label="Description">
                <Textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="What builders will create and why it matters."
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status">
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={draft.status}
                    onChange={(event) =>
                      setDraft({ ...draft, status: event.target.value as HackathonStatus })
                    }
                  >
                    <option>Open</option>
                    <option>Upcoming</option>
                    <option>Ended</option>
                  </select>
                </Field>
                <Field label="Location">
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={draft.location}
                    onChange={(event) =>
                      setDraft({ ...draft, location: event.target.value as HackathonLocation })
                    }
                  >
                    <option>Online</option>
                    <option>In-person</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Timeline">
                  <Input
                    value={draft.timeLeft}
                    onChange={(event) => setDraft({ ...draft, timeLeft: event.target.value })}
                    placeholder="4 weeks to go"
                  />
                </Field>
                <Field label="Prize">
                  <Input
                    value={draft.prize}
                    onChange={(event) => setDraft({ ...draft, prize: event.target.value })}
                    placeholder="PHP 25,000"
                  />
                </Field>
                <Field label="Teams">
                  <Input
                    min="0"
                    type="number"
                    value={draft.participants}
                    onChange={(event) => setDraft({ ...draft, participants: event.target.value })}
                  />
                </Field>
              </div>

              <Field label="Tags">
                <Input
                  value={draft.tags}
                  onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                  placeholder="AI/ML, Social Impact"
                />
              </Field>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingHackathon ? "Save Changes" : "Save Hackathon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {hackathons.map((hackathon) => {
          const canEdit = hackathon.createdBy === user?.uid;

          return (
            <Card key={hackathon.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{hackathon.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{hackathon.organizer}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge className={STATUS_STYLES[hackathon.status]}>{hackathon.status}</Badge>
                    {canEdit && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleEdit(hackathon)}
                        aria-label={`Edit ${hackathon.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {hackathon.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{hackathon.description}</p>
                )}
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {hackathon.timeLeft}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {hackathon.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {hackathon.participants.toLocaleString()} teams
                  </div>
                  <div className="font-semibold text-foreground">{hackathon.prize} prize pool</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
