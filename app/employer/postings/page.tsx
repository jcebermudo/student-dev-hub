"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { Briefcase, CalendarDays, Eye, Loader2, MapPin, Plus, Star, Users } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import {
  POSTING_STATUS_CONFIG,
  MOCK_POSTINGS,
  mergePostings,
  normalizePosting,
  type Posting,
  type PostingStatus,
  type PostingType,
} from "@/lib/postings";

type PostingDraft = {
  title: string;
  company: string;
  type: PostingType;
  location: string;
  isRemote: boolean;
  description: string;
  requirements: string;
  preferredSkills: string;
  minCredibilityScore: string;
  deadline: string;
};

const EMPTY_DRAFT: PostingDraft = {
  title: "",
  company: "",
  type: "internship",
  location: "",
  isRemote: false,
  description: "",
  requirements: "",
  preferredSkills: "",
  minCredibilityScore: "",
  deadline: "",
};

type PostingFilter = "all" | "active" | "draft" | "closed";

export default function PostingsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [databasePostings, setDatabasePostings] = useState<Posting[]>([]);
  const [activeTab, setActiveTab] = useState<PostingFilter>("all");
  const [open, setOpen] = useState(() => searchParams.get("create") === "1");
  const [draft, setDraft] = useState<PostingDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [listenerError, setListenerError] = useState("");

  useEffect(() => {
    return onSnapshot(
      collection(db, "postings"),
      (snapshot) => {
        setListenerError("");
        setDatabasePostings(snapshot.docs.map((doc) => normalizePosting(doc.id, doc.data())));
      },
      () => {
        setListenerError(
          "Firestore permissions are blocking live postings. Showing mock postings for now."
        );
      }
    );
  }, []);

  const postings = useMemo(() => mergePostings(databasePostings), [databasePostings]);
  const filteredPostings = postings.filter((posting) => {
    if (activeTab === "all") return true;
    return posting.status === activeTab;
  });

  const activeCount = postings.filter((posting) => posting.status === "active").length;
  const applicantCount = postings.reduce((sum, posting) => sum + posting.applicants, 0);
  const avgCredibility = postings.length
    ? Math.round(
        postings.reduce((sum, posting) => sum + (posting.minCredibilityScore ?? 0), 0) /
          postings.length
      )
    : 0;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setError("");

    if (nextOpen) {
      setDraft((current) => ({
        ...current,
        company: current.company || user?.displayName || "",
      }));
    } else {
      setDraft({ ...EMPTY_DRAFT, company: user?.displayName || "" });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!draft.title.trim() || !draft.company.trim()) {
      setError("Title and company are required.");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "postings"), {
        title: draft.title.trim(),
        company: draft.company.trim(),
        type: draft.type,
        location: draft.isRemote ? "Remote" : draft.location.trim() || "TBD",
        isRemote: draft.isRemote,
        description: draft.description.trim() || "Role details will be shared soon.",
        requirements: splitList(draft.requirements),
        preferredSkills: splitList(draft.preferredSkills),
        minCredibilityScore: Number(draft.minCredibilityScore) || 0,
        applicants: 0,
        status: "active" satisfies PostingStatus,
        postedAt: new Date().toISOString().slice(0, 10),
        deadline: draft.deadline || null,
        createdBy: user?.uid ?? null,
        createdByName: user?.displayName ?? null,
        createdAt: serverTimestamp(),
      });

      setDraft({ ...EMPTY_DRAFT, company: user?.displayName || "" });
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create posting.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedMockPostings() {
    if (!user) {
      setError("Sign in first to save mock postings.");
      return;
    }

    setSeeding(true);
    setError("");
    setNotice("");

    try {
      await Promise.all(
        MOCK_POSTINGS.map((posting) =>
          setDoc(
            doc(db, "postings", `mock-${user.uid}-${posting.id}`),
            {
              ...posting,
              createdBy: user.uid,
              createdByName: user.displayName ?? "Mock data",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
        )
      );
      setNotice("Saved 6 mock postings to Firestore.");
    } catch {
      setError("Could not save mock postings. Make sure this account has the employer role in Firestore rules.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Postings</h1>
          <p className="text-muted-foreground">Manage your job and internship postings.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
         
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create Posting
              </Button>
            </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create posting</DialogTitle>
              <DialogDescription>
                Saved postings appear in the student match queue as jobs or internships.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <Input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="Frontend Developer"
                    required
                  />
                </Field>
                <Field label="Company">
                  <Input
                    value={draft.company}
                    onChange={(event) => setDraft({ ...draft, company: event.target.value })}
                    placeholder="Company name"
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Type">
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={draft.type}
                    onChange={(event) =>
                      setDraft({ ...draft, type: event.target.value as PostingType })
                    }
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                  </select>
                </Field>
                <Field label="Location">
                  <Input
                    value={draft.location}
                    disabled={draft.isRemote}
                    onChange={(event) => setDraft({ ...draft, location: event.target.value })}
                    placeholder="Makati, PH"
                  />
                </Field>
                <Field label="Deadline">
                  <Input
                    type="date"
                    value={draft.deadline}
                    onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isRemote}
                  onChange={(event) => setDraft({ ...draft, isRemote: event.target.checked })}
                />
                Remote position
              </label>

              <Field label="Description">
                <Textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="Describe the role, responsibilities, and team."
                  rows={4}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Requirements">
                  <Input
                    value={draft.requirements}
                    onChange={(event) => setDraft({ ...draft, requirements: event.target.value })}
                    placeholder="React, TypeScript"
                  />
                </Field>
                <Field label="Preferred skills">
                  <Input
                    value={draft.preferredSkills}
                    onChange={(event) =>
                      setDraft({ ...draft, preferredSkills: event.target.value })
                    }
                    placeholder="Next.js, Firebase"
                  />
                </Field>
                <Field label="Min. score">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={draft.minCredibilityScore}
                    onChange={(event) =>
                      setDraft({ ...draft, minCredibilityScore: event.target.value })
                    }
                    placeholder="75"
                  />
                </Field>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Posting
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {listenerError && (
        <div className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {listenerError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Postings" value={postings.length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard title="Active" value={activeCount} icon={<Eye className="h-4 w-4 text-emerald-500" />} />
        <StatCard title="Total Applicants" value={applicantCount.toLocaleString()} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Avg. Credibility" value={`${avgCredibility}%`} icon={<Star className="h-4 w-4 text-amber-500" />} />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Min. Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostings.map((posting) => (
                    <TableRow
                      key={posting.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer"
                      onClick={() => setSelectedPosting(posting)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedPosting(posting);
                        }
                      }}
                    >
                      <TableCell>
                        <div className="font-medium">{posting.title}</div>
                        <div className="text-xs text-muted-foreground">{posting.company}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{posting.type === "internship" ? "Internship" : "Job"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {posting.isRemote ? "Remote" : posting.location}
                      </TableCell>
                      <TableCell>{posting.applicants}</TableCell>
                      <TableCell>{posting.minCredibilityScore ?? 0}%</TableCell>
                      <TableCell>
                        <Badge className={POSTING_STATUS_CONFIG[posting.status].className}>
                          {POSTING_STATUS_CONFIG[posting.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {posting.deadline ? new Date(posting.deadline).toLocaleDateString() : "TBD"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedPosting(posting);
                          }}
                          aria-label={`View ${posting.title} details`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedPosting} onOpenChange={(nextOpen) => !nextOpen && setSelectedPosting(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedPosting && (
            <>
              <DialogHeader>
                <div className="space-y-3 pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {selectedPosting.type === "internship" ? "Internship" : "Job"}
                    </Badge>
                    <Badge className={POSTING_STATUS_CONFIG[selectedPosting.status].className}>
                      {POSTING_STATUS_CONFIG[selectedPosting.status].label}
                    </Badge>
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedPosting.title}</DialogTitle>
                    <DialogDescription>{selectedPosting.company}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5">
                <p className="text-sm leading-relaxed">{selectedPosting.description}</p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <PostingInfo
                    icon={<Users className="h-4 w-4" />}
                    label="Applicants"
                    value={selectedPosting.applicants.toLocaleString()}
                  />
                  <PostingInfo
                    icon={<Star className="h-4 w-4" />}
                    label="Min. score"
                    value={`${selectedPosting.minCredibilityScore ?? 0}%`}
                  />
                  <PostingInfo
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Deadline"
                    value={selectedPosting.deadline ? new Date(selectedPosting.deadline).toLocaleDateString() : "TBD"}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {selectedPosting.isRemote ? "Remote" : selectedPosting.location}
                </div>

                <SkillGroup title="Requirements" skills={selectedPosting.requirements} />
                <SkillGroup title="Preferred skills" skills={selectedPosting.preferredSkills} />

                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Recruiting note</p>
                  <p className="text-muted-foreground">
                    Review applicants against the minimum credibility score and preferred skills before shortlisting.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedPosting(null)}>
                  Close
                </Button>
                <Button type="button" disabled>
                  Manage Applicants
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
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

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function PostingInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border p-3">
      <div className="mb-2 text-muted-foreground">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function SkillGroup({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} listed.</p>
      )}
    </div>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
