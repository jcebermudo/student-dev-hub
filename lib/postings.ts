export type PostingType = "internship" | "job";
export type PostingStatus = "active" | "draft" | "closed";

export type Posting = {
  id: string;
  title: string;
  company: string;
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
  createdBy?: string;
  createdByName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export const MOCK_POSTINGS: Posting[] = [
  {
    id: "mock-backend-engineering-intern",
    title: "Backend Engineering Intern",
    company: "Grab",
    type: "internship",
    location: "Makati, PH",
    isRemote: false,
    description: "Work on core ride-matching algorithms serving millions of daily users across Southeast Asia.",
    requirements: ["Go or Python", "REST APIs", "Distributed systems"],
    preferredSkills: ["Kubernetes", "gRPC", "PostgreSQL"],
    minCredibilityScore: 70,
    applicants: 214,
    status: "active",
    postedAt: "2025-05-15",
    deadline: "2025-07-15",
  },
  {
    id: "mock-frontend-developer",
    title: "Frontend Developer",
    company: "Shopee",
    type: "job",
    location: "Remote",
    isRemote: true,
    description: "Build fast storefront and seller workflows with React, TypeScript, and design systems.",
    requirements: ["React", "TypeScript", "Component architecture"],
    preferredSkills: ["Next.js", "Tailwind CSS", "GraphQL"],
    minCredibilityScore: 75,
    applicants: 183,
    status: "active",
    postedAt: "2025-05-20",
    deadline: "2025-06-30",
  },
  {
    id: "mock-full-stack-developer",
    title: "Full Stack Developer",
    company: "Accenture Philippines",
    type: "job",
    location: "BGC, Taguig",
    isRemote: false,
    description: "Develop enterprise web tools for regional clients across product, data, and operations teams.",
    requirements: ["Node.js", "React", "Database design"],
    preferredSkills: ["AWS", "Docker", "CI/CD"],
    minCredibilityScore: 80,
    applicants: 156,
    status: "active",
    postedAt: "2025-05-10",
    deadline: "2025-06-25",
  },
  {
    id: "mock-ai-ml-intern",
    title: "AI/ML Intern",
    company: "Maya",
    type: "internship",
    location: "Remote",
    isRemote: true,
    description: "Prototype ML models for fraud detection, customer insights, and responsible financial products.",
    requirements: ["Python", "ML fundamentals", "Data analysis"],
    preferredSkills: ["PyTorch", "SQL", "MLOps"],
    minCredibilityScore: 85,
    applicants: 121,
    status: "draft",
    postedAt: "2025-05-25",
    deadline: "2025-08-01",
  },
  {
    id: "mock-cloud-engineering-intern",
    title: "Cloud Engineering Intern",
    company: "Globe Telecom",
    type: "internship",
    location: "Mandaluyong, PH",
    isRemote: false,
    description: "Support cloud infrastructure, monitoring, and deployment automation for nationwide services.",
    requirements: ["Linux", "Cloud basics", "Networking"],
    preferredSkills: ["AWS", "Terraform", "Docker"],
    minCredibilityScore: 65,
    applicants: 98,
    status: "closed",
    postedAt: "2025-03-01",
    deadline: "2025-05-01",
  },
  {
    id: "mock-mobile-engineer",
    title: "Mobile Engineer",
    company: "UnionBank",
    type: "job",
    location: "Pasig, PH",
    isRemote: false,
    description: "Ship secure mobile banking experiences with a focus on performance and accessibility.",
    requirements: ["Flutter or React Native", "API integration", "Mobile testing"],
    preferredSkills: ["Firebase", "Design systems", "Security basics"],
    minCredibilityScore: 78,
    applicants: 147,
    status: "active",
    postedAt: "2025-05-18",
    deadline: "2025-07-10",
  },
];

export const POSTING_STATUS_CONFIG: Record<PostingStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  draft: { label: "Draft", className: "bg-amber-100 text-amber-700" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-700" },
};

export function normalizePosting(id: string, data: Record<string, unknown>): Posting {
  return {
    id,
    title: String(data.title ?? "Untitled Posting"),
    company: String(data.company ?? data.createdByName ?? "Company"),
    type: isPostingType(data.type) ? data.type : "internship",
    location: String(data.location ?? "Remote"),
    isRemote: Boolean(data.isRemote),
    description: String(data.description ?? ""),
    requirements: arrayOfStrings(data.requirements),
    preferredSkills: arrayOfStrings(data.preferredSkills),
    minCredibilityScore:
      typeof data.minCredibilityScore === "number" ? data.minCredibilityScore : undefined,
    applicants: typeof data.applicants === "number" ? data.applicants : 0,
    status: isPostingStatus(data.status) ? data.status : "active",
    postedAt: String(data.postedAt ?? new Date().toISOString().slice(0, 10)),
    deadline: typeof data.deadline === "string" ? data.deadline : undefined,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : undefined,
    createdByName: typeof data.createdByName === "string" ? data.createdByName : undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function mergePostings(databasePostings: Posting[]): Posting[] {
  const seen = new Set<string>();

  return [...databasePostings, ...MOCK_POSTINGS].filter((posting) => {
    const key = `${posting.title.trim().toLowerCase()}::${posting.company
      .trim()
      .toLowerCase()}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function arrayOfStrings(value: unknown) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map(String).map((item) => item.trim()).filter(Boolean))];
}

function isPostingType(value: unknown): value is PostingType {
  return value === "internship" || value === "job";
}

function isPostingStatus(value: unknown): value is PostingStatus {
  return value === "active" || value === "draft" || value === "closed";
}
