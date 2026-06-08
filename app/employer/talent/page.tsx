"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_TALENT, type MockTalent } from "@/lib/talent";
import { BriefcaseBusiness, GraduationCap, Mail, MapPin, Search, Star, Users } from "lucide-react";

export default function TalentSearchPage() {
  const [query, setQuery] = useState("");
  const [selectedTalent, setSelectedTalent] = useState<MockTalent | null>(null);

  const filteredTalent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return MOCK_TALENT;
    }

    return MOCK_TALENT.filter((person) =>
      [
        person.name,
        person.school,
        person.role,
        person.looking,
        person.location,
        person.bio,
        person.availability,
        ...person.skills,
        ...person.projects,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Talent Search</h1>
        <p className="text-muted-foreground">Browse student developers from the mock talent pool.</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, school, role, or skill..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTalent.map((person) => (
          <Card
            key={person.id}
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={() => setSelectedTalent(person)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedTalent(person);
              }
            }}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image src={person.image} alt={person.name} fill className="object-cover" />
                </div>
                <div>
                  <CardTitle>{person.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {person.role} / {person.school}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 text-amber-500" />
                {person.score}%
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="line-clamp-2 text-sm text-muted-foreground">{person.bio}</p>
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

      {filteredTalent.length === 0 && (
        <div className="border border-dashed p-8 text-center">
          <p className="font-medium">No talent found</p>
          <p className="text-sm text-muted-foreground">Try searching another skill, school, or role.</p>
        </div>
      )}

      <Dialog open={!!selectedTalent} onOpenChange={(open) => !open && setSelectedTalent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedTalent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                      <Image src={selectedTalent.image} alt={selectedTalent.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-xl">{selectedTalent.name}</DialogTitle>
                      <DialogDescription>
                        {selectedTalent.role} at {selectedTalent.school}
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 text-amber-500" />
                    {selectedTalent.score}% match
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5">
                <p className="text-sm leading-relaxed">{selectedTalent.bio}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem icon={<GraduationCap className="h-4 w-4" />} label="School" value={selectedTalent.school} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="Location" value={selectedTalent.location} />
                  <InfoItem icon={<BriefcaseBusiness className="h-4 w-4" />} label="Experience" value={selectedTalent.experience} />
                  <InfoItem icon={<Users className="h-4 w-4" />} label="Looking for" value={selectedTalent.looking} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalent.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Projects</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedTalent.projects.map((project) => (
                      <div key={project} className="border p-3 text-sm">
                        {project}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Availability</p>
                  <p className="text-muted-foreground">{selectedTalent.availability}</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedTalent(null)}>
                  Close
                </Button>
                <Button type="button" asChild>
                  <Link href="/employer/chat">
                    <Mail className="h-4 w-4" />
                    Contact Talent
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border p-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
