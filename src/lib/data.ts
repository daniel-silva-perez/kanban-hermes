export type TaskStatus = "suggestions" | "ready" | "in-progress" | "review" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Assignee = "danny" | "hermes" | "both";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  project: string;
}

export interface Column {
  id: TaskStatus;
  label: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "suggestions", label: "Suggestions", color: "#f59e0b" },
  { id: "ready", label: "Ready", color: "#3b82f6" },
  { id: "in-progress", label: "In Progress", color: "#8b5cf6" },
  { id: "review", label: "Review", color: "#ef4444" },
  { id: "completed", label: "Completed", color: "#22c55e" },
];

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const PROJECTS: Project[] = [
  { id: "daniel-search", name: "daniel-search", description: "Personal portfolio search experience", icon: "🔍", color: "#3b82f6" },
  { id: "ai-label", name: "ai-label", description: "AI-powered record label platform", icon: "🎵", color: "#8b5cf6" },
  { id: "openclaw", name: "openclaw", description: "Multi-agent AI gateway system", icon: "🤖", color: "#ef4444" },
  { id: "research-hub", name: "research-hub", description: "Interactive research canvas", icon: "📊", color: "#22c55e" },
  { id: "general", name: "general", description: "Cross-project tasks and ideas", icon: "⚡", color: "#f59e0b" },
];

export const INITIAL_TASKS: Task[] = [
  // === DANIEL-SEARCH ===
  {
    id: "ds-1",
    title: "Add 'At a Glance' credibility bar",
    description: "Horizontal micro-stats row below hero: years coding, projects shipped, current role, focus area. Pill/badge style.",
    status: "suggestions",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "homepage"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "ds-2",
    title: "Add external links to project cards",
    description: "Render href (live demo) and repo (GitHub) links on ItemCard. Arrow + GitHub icons. Hover: muted → foreground.",
    status: "suggestions",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "projects"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "ds-3",
    title: "Add 'Currently At' Amazon badge",
    description: "Small pill near hero: 'Currently: GM Assistant @ Amazon · Miami, FL'. Briefcase icon optional.",
    status: "suggestions",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "homepage"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "ds-4",
    title: "Add 'Built with' tech logo strip",
    description: "Horizontal strip: Next.js, TypeScript, Tailwind, Vercel, Local LLMs. Grayscale, muted opacity, hover full.",
    status: "suggestions",
    priority: "medium",
    assignee: "hermes",
    tags: ["social-proof", "homepage"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "ds-5",
    title: "Add quantifiable metrics to descriptions",
    description: "Update data.ts with numbers: '500+ daily interactions', '$X/month processed', '95+ Lighthouse'.",
    status: "suggestions",
    priority: "medium",
    assignee: "danny",
    tags: ["social-proof", "copy"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "ds-6",
    title: "Add testimonial / endorsement section",
    description: "Blockquote with third-party quote. Left border foreground, italic muted. Even one quote beats zero.",
    status: "suggestions",
    priority: "low",
    assignee: "danny",
    tags: ["social-proof", "testimonials"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  // === AI-LABEL ===
  {
    id: "al-1",
    title: "Set up Supabase schema for artists",
    description: "Tables: artists, tracks, releases, distributions. RLS policies.",
    status: "ready",
    priority: "high",
    assignee: "hermes",
    tags: ["backend", "database"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "ai-label",
  },
  {
    id: "al-2",
    title: "Build track upload flow",
    description: "Drag-and-drop upload to R2, metadata extraction, waveform preview.",
    status: "in-progress",
    priority: "high",
    assignee: "hermes",
    tags: ["frontend", "upload"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "ai-label",
  },
  {
    id: "al-3",
    title: "Design artist dashboard UI",
    description: "Analytics, release management, earnings overview. Mobile-first.",
    status: "suggestions",
    priority: "medium",
    assignee: "hermes",
    tags: ["design", "dashboard"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "ai-label",
  },
  // === OPENCLAW ===
  {
    id: "oc-1",
    title: "Document multi-agent routing",
    description: "Clear docs on how main + stacy agents route messages and share context.",
    status: "ready",
    priority: "medium",
    assignee: "hermes",
    tags: ["docs", "routing"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "openclaw",
  },
  {
    id: "oc-2",
    title: "Add agent memory persistence",
    description: "SQLite-backed memory with context window management and retrieval.",
    status: "suggestions",
    priority: "high",
    assignee: "hermes",
    tags: ["backend", "memory"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "openclaw",
  },
  // === RESEARCH-HUB ===
  {
    id: "rh-1",
    title: "Add full-text search",
    description: "Integrate Fuse.js or similar for fuzzy search across all research notes.",
    status: "in-progress",
    priority: "medium",
    assignee: "hermes",
    tags: ["search", "frontend"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "research-hub",
  },
  {
    id: "rh-2",
    title: "Export notes to PDF",
    description: "Generate styled PDFs from markdown research notes with citations.",
    status: "suggestions",
    priority: "low",
    assignee: "hermes",
    tags: ["export", "pdf"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "research-hub",
  },
  // === GENERAL ===
  {
    id: "gn-1",
    title: "Kanban drag-and-drop",
    description: "Native HTML5 DnD or @dnd-kit for moving tasks between columns.",
    status: "completed",
    priority: "high",
    assignee: "hermes",
    tags: ["kanban", "ux"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
  {
    id: "gn-2",
    title: "Kanban localStorage persistence",
    description: "Persist task state to localStorage. Export/import JSON backup.",
    status: "suggestions",
    priority: "medium",
    assignee: "hermes",
    tags: ["kanban", "data"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
  {
    id: "gn-3",
    title: "Kanban task creation modal",
    description: "Form to create new tasks with title, description, priority, assignee, tags.",
    status: "ready",
    priority: "high",
    assignee: "hermes",
    tags: ["kanban", "feature"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
];
