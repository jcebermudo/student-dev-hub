import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Building2, GraduationCap } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// --- GitHub-style contribution grid (fake data) ---
function generateContributions() {
  const weeks = 52;
  const days = 7;
  const grid: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // weighted toward lower values for realism
      const rand = Math.random();
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

// --- Data ---
const EXPERIENCES = [
  {
    company: "Mapua University",
    role: "Research Assistant",
    period: "2024-2025",
    logo: "M",
  },
];

const EDUCATION = [
  {
    school: "Ateneo de Manila University",
    degree: "BS Computer Science",
    period: "2022 - 2026",
    logo: "A",
  },
];

const SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Go",
  "Distributed Systems",
  "PostgreSQL",
];

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 border-2 border-border">
          <AvatarImage src="/images/people/nico-reyes.jpg" alt="Nico Reyes" />
          <AvatarFallback className="text-2xl font-semibold bg-muted">
            NR
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Nico Reyes <span className="text-muted-foreground font-normal text-base">@nico</span>
          </h1>
          <p className="text-muted-foreground">CS @ ADMU</p>
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
              Manila, PH
            </span>
          </div>
        </div>
      </div>

      {/* ── GitHub Commits ── */}
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

      {/* ── About ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          About
        </h2>
        <Card>
          <CardContent className="pt-5 pb-5 px-5">
            <p className="text-[15px] leading-relaxed">
              I&apos;m a passionate CS student who loves distributed systems
              and language design. Currently exploring compilers, low-level
              networking, and building tools that make developers&apos; lives
              easier.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Skills ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
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

      {/* ── Experience ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Experience
        </h2>
        <div className="space-y-3">
          {EXPERIENCES.map((exp) => (
            <Card key={exp.company}>
              <CardContent className="flex items-center gap-4 py-2.5 px-5">
                <img src="/images/mapua.png" alt={exp.company} className="h-11 w-11 shrink-0 rounded-md object-cover" />
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

      {/* ── Education ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Education
        </h2>
        <div className="space-y-3">
          {EDUCATION.map((edu) => (
            <Card key={edu.school}>
              <CardContent className="flex items-center gap-4 py-2.5 px-5">
                <img src="/images/admu.jpeg" alt={edu.school} className="h-11 w-11 shrink-0 rounded-md object-cover" />
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
