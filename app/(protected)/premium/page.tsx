import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Check, Eye, Sparkles } from "lucide-react"

const FEATURES = [
  {
    title: "Portfolio insights",
    description: "Get clearer feedback on strengths, gaps, and what recruiters may notice first.",
    icon: BarChart3,
  },
  {
    title: "Priority visibility",
    description: "Show higher in recruiter searches for internships, teams, and hackathon opportunities.",
    icon: Eye,
  },
  {
    title: "Profile boost",
    description: "Highlight your top skills and projects with a premium marker for recruiters.",
    icon: Sparkles,
  },
]

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <main className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Premium</h1>
          <p className="text-sm text-muted-foreground">Upgrade your profile visibility and portfolio insights.</p>
        </div>

        <Card className="p-0">
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6 p-6">
              <div className="space-y-3">
                <Badge className="bg-amber-100 text-amber-700">Student Premium</Badge>
                <div>
                  <h2 className="text-2xl font-bold">Get more portfolio insight and recruiter visibility</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Premium is a simple monthly upgrade for students who want clearer portfolio signals and better visibility to recruiters.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {FEATURES.map((feature) => (
                  <Card key={feature.title} size="sm">
                    <CardHeader>
                      <feature.icon className="h-5 w-5 text-primary" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="border-t bg-muted/30 p-6 lg:border-l lg:border-t-0">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">PHP 150</span>
                    <span className="pb-1 text-sm text-muted-foreground">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    {["More portfolio insights", "Priority visibility to recruiters", "Premium profile highlight"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button disabled className="w-full">
                    Upgrade coming soon
                  </Button>
                  <p className="text-xs text-muted-foreground">Subscriptions are not available yet.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
