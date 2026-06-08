export type MockTalent = {
  type: "teammate";
  id: number;
  name: string;
  school: string;
  role: string;
  bio: string;
  skills: string[];
  color: string;
  initials: string;
  looking: string;
  image: string;
  score: number;
  location: string;
  email: string;
  experience: string;
  projects: string[];
  availability: string;
};

export const MOCK_TALENT: MockTalent[] = [
  {
    type: "teammate",
    id: 101,
    name: "Maria Santos",
    school: "DLSU",
    role: "Frontend Developer",
    bio: "Passionate about accessible UIs and design systems. Looking for a hackathon team.",
    skills: ["React", "Figma", "TypeScript"],
    color: "bg-pink-500",
    initials: "MS",
    looking: "Hackathon teammate",
    image: "/images/people/maria-santos.jpg",
    score: 92,
    location: "Manila, Philippines",
    email: "maria.santos@studentdevhub.test",
    experience: "2 internships",
    projects: ["Scholarship tracker", "Campus events app"],
    availability: "Open to internships and hackathon teams",
  },
  {
    type: "teammate",
    id: 102,
    name: "Juan Reyes",
    school: "UP Diliman",
    role: "Backend Developer",
    bio: "Systems nerd who loves distributed systems. Seeking a co-founder for a fintech startup.",
    skills: ["Go", "PostgreSQL", "Docker"],
    color: "bg-indigo-500",
    initials: "JR",
    looking: "Startup co-founder",
    image: "/images/people/juan-reyes.jpg",
    score: 88,
    location: "Quezon City, Philippines",
    email: "juan.reyes@studentdevhub.test",
    experience: "Freelance API projects",
    projects: ["Inventory API", "Realtime queue monitor"],
    availability: "Open to part-time backend roles",
  },
  {
    type: "teammate",
    id: 103,
    name: "Ana Cruz",
    school: "ADMU",
    role: "ML Engineer",
    bio: "Research assistant at the AI Lab. Looking to apply ML in social good projects.",
    skills: ["Python", "PyTorch", "Data Viz"],
    color: "bg-emerald-500",
    initials: "AC",
    looking: "Research partner",
    image: "/images/people/ana-cruz.jpg",
    score: 86,
    location: "Pasig, Philippines",
    email: "ana.cruz@studentdevhub.test",
    experience: "Research assistant",
    projects: ["Campus energy forecast", "Study habit classifier"],
    availability: "Open to AI internships and research teams",
  },
  {
    type: "teammate",
    id: 104,
    name: "Miguel Lim",
    school: "UST",
    role: "iOS Developer",
    bio: "Building AR experiences since freshman year. Looking for hackathon teams in spatial computing.",
    skills: ["Swift", "ARKit", "Xcode"],
    color: "bg-orange-500",
    initials: "ML",
    looking: "Hackathon teammate",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    score: 84,
    location: "Manila, Philippines",
    email: "miguel.lim@studentdevhub.test",
    experience: "AR prototype builder",
    projects: ["AR campus guide", "Spatial computing demo"],
    availability: "Open to iOS internships and hackathon teams",
  },
  {
    type: "teammate",
    id: 105,
    name: "Sofia Dela Rosa",
    school: "DLSU",
    role: "Product Manager",
    bio: "Bridge between design and engineering. Looking for a technical co-founder for EdTech.",
    skills: ["Figma", "Notion", "SQL"],
    color: "bg-violet-500",
    initials: "SD",
    looking: "Startup co-founder",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    score: 89,
    location: "Taguig, Philippines",
    email: "sofia.delarosa@studentdevhub.test",
    experience: "Student product lead",
    projects: ["EdTech validation board", "Student planner MVP"],
    availability: "Open to product internships and co-founder chats",
  },
  {
    type: "teammate",
    id: 106,
    name: "Paolo Garcia",
    school: "MAPUA",
    role: "DevOps Engineer",
    bio: "I love automating everything. Happy to join any team that needs solid infrastructure.",
    skills: ["AWS", "Kubernetes", "CI/CD"],
    color: "bg-teal-500",
    initials: "PG",
    looking: "Any team",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    score: 81,
    location: "Makati, Philippines",
    email: "paolo.garcia@studentdevhub.test",
    experience: "Cloud club lead",
    projects: ["Serverless deploy kit", "Kubernetes lab templates"],
    availability: "Open to cloud and platform internships",
  },
];
