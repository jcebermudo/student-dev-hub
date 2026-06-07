import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Briefcase, Eye, Trophy, Users } from "lucide-react";

const METRICS = [
  { label: "Profile Views", value: "12.4k", note: "+18% this month", icon: Eye },
  { label: "Applicants", value: "847", note: "across all postings", icon: Users },
  { label: "Open Positions", value: "12", note: "active listings", icon: Briefcase },
  { label: "Hackathon Teams", value: "13,153", note: "from active events", icon: Trophy },
];

const SOURCES = [
  { name: "Backend Engineering Intern", count: 214, rate: "24%" },
  { name: "Frontend Intern", count: 183, rate: "21%" },
  { name: "Full Stack Intern", count: 156, rate: "18%" },
  { name: "AI / ML Intern", count: 121, rate: "14%" },
];

export default function EmployerAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Simple mock reporting for employer activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Applications by Posting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOURCES.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{source.name}</span>
                  <span className="text-muted-foreground">{source.count} applicants</span>
                </div>
                <div className="h-2 bg-muted">
                  <div className="h-2 bg-primary" style={{ width: source.rate }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Viewed postings</span>
              <span className="font-medium">12,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started applications</span>
              <span className="font-medium">1,920</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted applications</span>
              <span className="font-medium">847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shortlisted talent</span>
              <span className="font-medium">96</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
