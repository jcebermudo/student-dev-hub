import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy, Users } from "lucide-react";

const HACKATHONS = [
  {
    title: "Google Vertex AI Hackathon",
    organizer: "Google",
    status: "Open",
    timeLeft: "1 month to go",
    prize: "PHP 50,000",
    participants: 8412,
    tags: ["AI/ML", "Social Impact"],
  },
  {
    title: "Web3 Builders Sprint",
    organizer: "Ethereum Foundation",
    status: "Open",
    timeLeft: "3 weeks to go",
    prize: "PHP 30,000",
    participants: 3201,
    tags: ["Blockchain", "Web3"],
  },
  {
    title: "Beyond Tomorrow Summit",
    organizer: "Microsoft",
    status: "Open",
    timeLeft: "2 months to go",
    prize: "PHP 80,000",
    participants: 1540,
    tags: ["Climate", "Sustainability"],
  },
];

export default function EmployerHackathonsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hackathons</h1>
          <p className="text-muted-foreground">Track hosted and sponsored hackathons.</p>
        </div>
        <Button>
          <Trophy className="h-4 w-4" />
          Create Hackathon
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {HACKATHONS.map((hackathon) => (
          <Card key={hackathon.title}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{hackathon.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{hackathon.organizer}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">{hackathon.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {hackathon.timeLeft}
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
        ))}
      </div>
    </div>
  );
}
