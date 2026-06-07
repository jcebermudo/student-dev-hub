import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Users } from "lucide-react";

const TALENT = [
  {
    name: "Maria Santos",
    school: "DLSU",
    role: "Frontend Developer",
    looking: "Hackathon teammate",
    score: 92,
    skills: ["React", "Figma", "TypeScript"],
  },
  {
    name: "Juan Reyes",
    school: "UP Diliman",
    role: "Backend Developer",
    looking: "Startup co-founder",
    score: 88,
    skills: ["Go", "PostgreSQL", "Docker"],
  },
  {
    name: "Ana Cruz",
    school: "ADMU",
    role: "ML Engineer",
    looking: "Research partner",
    score: 86,
    skills: ["Python", "PyTorch", "Data Viz"],
  },
  {
    name: "Paolo Garcia",
    school: "MAPUA",
    role: "DevOps Engineer",
    looking: "Any team",
    score: 81,
    skills: ["AWS", "Kubernetes", "CI/CD"],
  },
];

export default function TalentSearchPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Talent Search</h1>
        <p className="text-muted-foreground">Browse student developers from the mock talent pool.</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, school, role, or skill..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TALENT.map((person) => (
          <Card key={person.name}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{person.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {person.role} · {person.school}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 text-amber-500" />
                {person.score}%
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {person.looking}
              </div>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
