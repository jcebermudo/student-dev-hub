"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";

type Experience = {
  company: string;
  role: string;
  period: string;
  logo: string;
  logoImage?: string;
};

type Education = {
  school: string;
  degree: string;
  period: string;
  logo: string;
  logoImage?: string;
};

type StudentProfile = {
  headline: string;
  location: string;
  about: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
};

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function generateContributions() {
  const weeks = 52;
  const days = 7;
  const grid: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = seededRandom(w * days + d + 1);
      if (rand < 0.35) week.push(0);
      else if (rand < 0.6) week.push(1);
      else if (rand < 0.8) week.push(2);
      else if (rand < 0.93) week.push(3);
      else week.push(4);
    }
    grid.push(week);
  }
  return grid;
}

const CONTRIB_COLORS = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

function ContributionGrid() {
  const grid = generateContributions();
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-full" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
      {grid.map((week, wi) =>
        week.map((level, di) => (
          <div
            key={`${wi}-${di}`}
            className={`aspect-square rounded-[2px] ${CONTRIB_COLORS[level]} transition-colors`}
          />
        ))
      )}
    </div>
  );
}

const EXPERIENCE_OPTIONS: Experience[] = [
  {
    company: "Mapua University",
    role: "Research Assistant",
    period: "2024-2025",
    logo: "M",
    logoImage: "/images/mapua.png",
  },
  {
    company: "De La Salle University",
    role: "AI Assistant",
    period: "2025-Present",
    logo: "",
    logoImage: "/images/DLSU.png",
  },
];

const EDUCATION_OPTIONS: Education[] = [
  {
    school: "Ateneo de Manila University",
    degree: "BS Computer Science",
    period: "2022 - 2026",
    logo: "A",
    logoImage: "/images/admu.jpeg",
  },
  {
    school: "University of Santo Tomas",
    degree: "BS Information Technology",
    period: "2022 - 2026",
    logo: "UST",
    logoImage: "/images/ust.png",
  },
];

const DEFAULT_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Go",
  "Distributed Systems",
  "PostgreSQL",
];

const DEFAULT_PROFILE: StudentProfile = {
  headline: "CS @ ADMU",
  location: "Manila, PH",
  about:
    "I'm a passionate CS student who loves distributed systems and language design. Currently exploring compilers, low-level networking, and building tools that make developers' lives easier.",
  experiences: [EXPERIENCE_OPTIONS[0]],
  education: [EDUCATION_OPTIONS[0]],
  skills: DEFAULT_SKILLS,
};

function normalizeProfile(data: Partial<StudentProfile> | undefined): StudentProfile {
  return {
    headline: data?.headline || DEFAULT_PROFILE.headline,
    location: data?.location || DEFAULT_PROFILE.location,
    about: data?.about || DEFAULT_PROFILE.about,
    experiences: data?.experiences?.length ? data.experiences.map(hydrateExperience) : DEFAULT_PROFILE.experiences,
    education: data?.education?.length ? data.education.map(hydrateEducation) : DEFAULT_PROFILE.education,
    skills: data?.skills?.length ? data.skills : DEFAULT_PROFILE.skills,
  };
}

function parseSkills(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function optionKey(item: Experience | Education) {
  return "company" in item ? `${item.company}-${item.role}` : `${item.school}-${item.degree}`;
}

function hydrateExperience(experience: Experience) {
  return EXPERIENCE_OPTIONS.find((option) => optionKey(option) === optionKey(experience)) ?? experience;
}

function hydrateEducation(education: Education) {
  return EDUCATION_OPTIONS.find((option) => optionKey(option) === optionKey(education)) ?? education;
}

function InstitutionLogo({ item }: { item: Experience | Education }) {
  const label = "company" in item ? item.company : item.school;

  if (item.logoImage) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-border">
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {item.logo}
        </span>
        <Image
          src={item.logoImage}
          alt={label}
          fill
          className="z-10 object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
      {item.logo}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [draft, setDraft] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const displayName = user?.displayName ?? "Nico Reyes";
  const email = user?.email ?? "";
  const photoURL = user?.photoURL ?? "/images/people/nico-reyes.jpg";
  const username = email ? email.split("@")[0] : "nico";
  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [displayName]
  );

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function loadProfile() {
      const userRef = doc(db, "users", currentUser.uid);
      const snapshot = await getDoc(userRef);
      const savedProfile = normalizeProfile(snapshot.data() as Partial<StudentProfile> | undefined);

      setProfile(savedProfile);
      setDraft(savedProfile);

      await setDoc(
        userRef,
        {
          uid: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          ...savedProfile,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    void loadProfile();
  }, [user]);

  async function saveProfile() {
    if (!user) return;

    const nextProfile = normalizeProfile(draft);
    setIsSaving(true);
    setSaveMessage(null);

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        ...nextProfile,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setProfile(nextProfile);
    setDraft(nextProfile);
    setIsEditing(false);
    setIsSaving(false);
    setSaveMessage("Profile saved!");
  }

  const activeExperience = draft.experiences[0] ?? EXPERIENCE_OPTIONS[0];
  const activeEducation = draft.education[0] ?? EDUCATION_OPTIONS[0];

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback className="text-2xl font-semibold bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {displayName} <span className="text-muted-foreground font-normal text-base">@{username}</span>
            </h1>
            <p className="text-muted-foreground">{profile.headline}</p>
            <div className="flex items-center gap-3 mt-2 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                <FaGithub className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
              </a>
              <span className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant={isEditing ? "outline" : "default"}
          onClick={() => {
            setDraft(profile);
            setIsEditing((current) => !current);
            setSaveMessage(null);
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {saveMessage && <p className="text-sm font-medium text-emerald-600">{saveMessage}</p>}

      {isEditing && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Headline</span>
                <Input value={draft.headline} onChange={(event) => setDraft({ ...draft, headline: event.target.value })} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Location</span>
                <Input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span className="font-medium">About me</span>
              <textarea
                value={draft.about}
                onChange={(event) => setDraft({ ...draft, about: event.target.value })}
                className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium">Skills</span>
              <Input
                value={draft.skills.join(", ")}
                onChange={(event) => setDraft({ ...draft, skills: parseSkills(event.target.value) })}
                placeholder="React, TypeScript, Firebase"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Experience</span>
                <select
                  value={optionKey(activeExperience)}
                  onChange={(event) => {
                    const selected = EXPERIENCE_OPTIONS.find((option) => optionKey(option) === event.target.value) ?? EXPERIENCE_OPTIONS[0];
                    setDraft({ ...draft, experiences: [selected] });
                  }}
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={optionKey(option)} value={optionKey(option)}>
                      {option.company} - {option.role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Education</span>
                <select
                  value={optionKey(activeEducation)}
                  onChange={(event) => {
                    const selected = EDUCATION_OPTIONS.find((option) => optionKey(option) === event.target.value) ?? EDUCATION_OPTIONS[0];
                    setDraft({ ...draft, education: [selected] });
                  }}
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {EDUCATION_OPTIONS.map((option) => (
                    <option key={optionKey(option)} value={optionKey(option)}>
                      {option.school} - {option.degree}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDraft(DEFAULT_PROFILE)}>
                Reset sample
              </Button>
              <Button type="button" onClick={saveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          GitHub Commits
        </h2>
        <Card>
          <CardContent className="py-[2.5px]">
            <ContributionGrid />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          About
        </h2>
        <Card>
          <CardContent className="pt-5 pb-5 px-5">
            <p className="text-[15px] leading-relaxed">
              {profile.about}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="font-normal text-[13px]"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Experience
        </h2>
        <div className="space-y-3">
          {profile.experiences.map((exp) => (
            <Card key={`${exp.company}-${exp.role}`}>
              <CardContent className="flex items-center gap-4 py-2.5 px-5">
                <InstitutionLogo item={exp} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-tight">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {exp.period}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Education
        </h2>
        <div className="space-y-3">
          {profile.education.map((edu) => (
            <Card key={`${edu.school}-${edu.degree}`}>
              <CardContent className="flex items-center gap-4 py-2.5 px-5">
                <InstitutionLogo item={edu} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-tight">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {edu.period}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
