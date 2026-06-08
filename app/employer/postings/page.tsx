"use client";
import { Briefcase } from "lucide-react";  // Add to existing lucide-react imports
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Copy, CalendarDays, Users, Star } from "lucide-react";

// Types
type PostingType = "internship" | "job";
type PostingStatus = "active" | "draft" | "closed";

type Posting = {
  id: string;
  title: string;
  type: PostingType;
  location: string;
  isRemote: boolean;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  minCredibilityScore?: number;
  applicants: number;
  status: PostingStatus;
  postedAt: string;
  deadline?: string;
};

// Mock data
const MOCK_POSTINGS: Posting[] = [
  {
    id: "1",
    title: "Backend Engineering Intern",
    type: "internship",
    location: "Makati, PH",
    isRemote: false,
    description: "Work on core ride-matching algorithms serving millions of daily users across Southeast Asia.",
    requirements: ["Strong knowledge of Go or Python", "Understanding of distributed systems", "Experience with REST APIs"],
    preferredSkills: ["Kubernetes", "gRPC", "PostgreSQL"],
    minCredibilityScore: 70,
    applicants: 214,
    status: "active",
    postedAt: "2025-05-15",
    deadline: "2025-07-15",
  },
  {
    id: "2",
    title: "Frontend Developer",
    type: "job",
    location: "Manila, PH",
    isRemote: true,
    description: "Build high-performance e-commerce UIs used by 200M+ shoppers in the region.",
    requirements: ["3+ years React experience", "TypeScript proficiency", "State management (Redux/Zustand)"],
    preferredSkills: ["Next.js", "Tailwind CSS", "GraphQL"],
    minCredibilityScore: 75,
    applicants: 183,
    status: "active",
    postedAt: "2025-05-20",
    deadline: "2025-06-30",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    type: "job",
    location: "BGC, Taguig",
    isRemote: false,
    description: "Develop enterprise solutions for Fortune 500 clients across Southeast Asia.",
    requirements: ["Node.js and React expertise", "AWS experience", "Database design skills"],
    preferredSkills: ["Terraform", "Docker", "CI/CD pipelines"],
    minCredibilityScore: 80,
    applicants: 156,
    status: "active",
    postedAt: "2025-05-10",
    deadline: "2025-06-25",
  },
  {
    id: "4",
    title: "AI/ML Intern",
    type: "internship",
    location: "Pasig, PH",
    isRemote: true,
    description: "Research and deploy ML models for fraud detection and credit scoring at scale.",
    requirements: ["Python and TensorFlow/PyTorch", "ML fundamentals", "Data analysis skills"],
    preferredSkills: ["MLOps", "SQL", "Data visualization"],
    minCredibilityScore: 85,
    applicants: 121,
    status: "draft",
    postedAt: "2025-05-25",
    deadline: "2025-08-01",
  },
  {
    id: "5",
    title: "Cloud Engineering Intern",
    type: "internship",
    location: "Mandaluyong, PH",
    isRemote: false,
    description: "Manage cloud infrastructure for a network serving 80M+ subscribers nationwide.",
    requirements: ["AWS or GCP basics", "Linux fundamentals", "Networking concepts"],
    preferredSkills: ["Docker", "Kubernetes", "Terraform"],
    minCredibilityScore: 65,
    applicants: 98,
    status: "closed",
    postedAt: "2025-03-01",
    deadline: "2025-05-01",
  },
];

const STATUS_CONFIG: Record<PostingStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  draft: { label: "Draft", className: "bg-amber-100 text-amber-700" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-700" },
};

// Create Posting Dialog Component
function CreatePostingDialog({ onPostingCreated }: { onPostingCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "internship" as PostingType,
    location: "",
    isRemote: false,
    description: "",
    requirements: "",
    preferredSkills: "",
    minCredibilityScore: 0,
    deadline: "",
  });

  const handleSubmit = () => {
    // TODO: Save to Firestore
    console.log("Create posting:", formData);
    setOpen(false);
    onPostingCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Posting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Posting</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job or internship posting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posting Title</Label>
              <Input
                placeholder="e.g., Backend Engineering Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as PostingType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="job">Full-time Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g., Makati, PH"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between space-y-0 pt-6">
              <Label>Remote Position</Label>
              <Switch
                checked={formData.isRemote}
                onCheckedChange={(v) => setFormData({ ...formData, isRemote: v })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Requirements (comma-separated)</Label>
            <Input
              placeholder="e.g., Python, REST APIs, Git"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Skills (comma-separated)</Label>
            <Input
              placeholder="e.g., Docker, Kubernetes, AWS"
              value={formData.preferredSkills}
              onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Credibility Score</Label>
              <Input
                type="number"
                placeholder="0-100"
                value={formData.minCredibilityScore || ""}
                onChange={(e) => setFormData({ ...formData, minCredibilityScore: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Posting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Edit Posting Dialog
function EditPostingDialog({ posting, onSave }: { posting: Posting; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(posting);

  const handleSave = () => {
    console.log("Save posting:", formData);
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Posting</DialogTitle>
          <DialogDescription>Update the details of this posting.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posting Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as PostingType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="job">Full-time Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between space-y-0 pt-6">
              <Label>Remote Position</Label>
              <Switch
                checked={formData.isRemote}
                onCheckedChange={(v) => setFormData({ ...formData, isRemote: v })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v as PostingStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Page Component
export default function PostingsPage() {
  const [postings, setPostings] = useState<Posting[]>(MOCK_POSTINGS);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "closed">("all");

  const filteredPostings = postings.filter((p) => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  const handleDelete = (id: string) => {
    setPostings(postings.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPostings(
      postings.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "closed" : "active" }
          : p
      )
    );
  };

  const handleDuplicate = (posting: Posting) => {
    const newPosting = {
      ...posting,
      id: Date.now().toString(),
      title: `${posting.title} (Copy)`,
      status: "draft" as PostingStatus,
      postedAt: new Date().toISOString().split("T")[0],
      applicants: 0,
    };
    setPostings([newPosting, ...postings]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Postings</h1>
          <p className="text-muted-foreground">Manage your job and internship postings.</p>
        </div>
        <CreatePostingDialog onPostingCreated={() => {}} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postings.filter((p) => p.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {postings.reduce((sum, p) => sum + p.applicants, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Credibility</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(postings.reduce((sum, p) => sum + (p.minCredibilityScore || 0), 0) / postings.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostings.map((posting) => (
                    <TableRow key={posting.id}>
                      <TableCell className="font-medium">{posting.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {posting.type === "internship" ? "Internship" : "Job"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {posting.isRemote ? "Remote" : posting.location}
                      </TableCell>
                      <TableCell>{posting.applicants}</TableCell>
                      <TableCell>
                        {posting.minCredibilityScore ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span>{posting.minCredibilityScore}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_CONFIG[posting.status].className}>
                          {STATUS_CONFIG[posting.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {posting.deadline ? new Date(posting.deadline).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <EditPostingDialog posting={posting} onSave={() => {}} />
                            <DropdownMenuItem onClick={() => handleToggleStatus(posting.id)}>
                              {posting.status === "active" ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Close
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(posting)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(posting.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}