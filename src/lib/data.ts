export type TaskStatus = "backlog" | "ready" | "in-progress" | "review" | "done";
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
  { id: "backlog", label: "Backlog", color: "var(--muted)" },
  { id: "ready", label: "Ready", color: "var(--info)" },
  { id: "in-progress", label: "In Progress", color: "var(--warning)" },
  { id: "review", label: "Review", color: "var(--danger)" },
  { id: "done", label: "Done", color: "var(--success)" },
];

export const PROJECTS = [
  "daniel-search",
  "ai-label",
  "openclaw",
  "research-hub",
  "general",
];

export const INITIAL_TASKS: Task[] = [
  // === SOCIAL PROOF SUGGESTIONS (from daniel-search analysis) ===
  {
    id: "s1",
    title: "Add 'At a Glance' credibility bar to homepage",
    description:
      "Add a horizontal row of 3-4 micro-stats below the hero description: years coding, projects shipped, current role, focus area. Uses existing pill/badge style. Mobile: 2x2 grid.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "homepage", "ui"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "s2",
    title: "Add external links to project cards",
    description:
      "Render href (live demo) and repo (GitHub) links on ItemCard. Use arrow and GitHub icons. Hover: muted → foreground. Only show when data exists.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "projects", "links"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "s3",
    title: "Add 'Currently At' badge (Amazon role)",
    description:
      "Small pill/badge near hero: 'Currently: General Manager Assistant @ Amazon · Miami, FL'. Uses muted color, briefcase icon optional. Instant credibility signal.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["social-proof", "homepage", "credibility"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "s4",
    title: "Add 'Built with' / 'Featured In' logo strip",
    description:
      "Horizontal strip of tech logos (Next.js, TypeScript, Tailwind, Vercel, Local LLMs). Grayscale, muted opacity, hover to full. Single row, horizontally scrollable on mobile.",
    status: "backlog",
    priority: "medium",
    assignee: "hermes",
    tags: ["social-proof", "homepage", "trust"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "s5",
    title: "Add quantifiable metrics to project descriptions",
    description:
      "Update data.ts descriptions with numbers: 'handling 500+ daily interactions', 'processing $X/month', '95+ Lighthouse score'. Even directional numbers boost trust.",
    status: "backlog",
    priority: "medium",
    assignee: "danny",
    tags: ["social-proof", "copy", "data"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  {
    id: "s6",
    title: "Add testimonial / endorsement section",
    description:
      "Blockquote section with at least one third-party quote. Left border in foreground, italic muted text. Even one quote beats zero. Can be added anytime.",
    status: "backlog",
    priority: "low",
    assignee: "danny",
    tags: ["social-proof", "testimonials", "trust"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "daniel-search",
  },
  // === AI LABEL PROJECT ===
  {
    id: "al1",
    title: "AI Label: Set up Supabase schema for artists",
    description: "Create tables: artists, tracks, releases, distributions. Set up RLS policies.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["backend", "database", "schema"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "ai-label",
  },
  {
    id: "al2",
    title: "AI Label: Build track upload flow",
    description: "Drag-and-drop upload to R2, metadata extraction, waveform preview.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["frontend", "upload", "r2"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "ai-label",
  },
  // === OPENCLAW PROJECT ===
  {
    id: "oc1",
    title: "OpenClaw: Document multi-agent routing",
    description: "Write clear docs on how main + stacy agents route messages and share context.",
    status: "backlog",
    priority: "medium",
    assignee: "hermes",
    tags: ["docs", "routing", "agents"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "openclaw",
  },
  // === RESEARCH HUB ===
  {
    id: "rh1",
    title: "Research Hub: Add full-text search",
    description: "Integrate Fuse.js or similar for fuzzy search across all research notes.",
    status: "backlog",
    priority: "medium",
    assignee: "hermes",
    tags: ["search", "frontend", "ux"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "research-hub",
  },
  // === GENERAL / KANBAN ===
  {
    id: "k1",
    title: "Kanban: Add drag-and-drop for task status",
    description: "Implement native HTML5 drag-and-drop or use @dnd-kit for moving tasks between columns.",
    status: "backlog",
    priority: "medium",
    assignee: "hermes",
    tags: ["kanban", "ux", "dnd"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
  {
    id: "k2",
    title: "Kanban: Add localStorage persistence",
    description: "Persist task state to localStorage so board survives refresh. Export/import JSON backup.",
    status: "backlog",
    priority: "medium",
    assignee: "hermes",
    tags: ["kanban", "persistence", "data"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
  {
    id: "k3",
    title: "Kanban: Add task creation modal",
    description: "Form to create new tasks with title, description, priority, assignee, tags, project. Validate and append to board.",
    status: "backlog",
    priority: "high",
    assignee: "hermes",
    tags: ["kanban", "feature", "form"],
    createdAt: "2026-05-02",
    updatedAt: "2026-05-02",
    project: "general",
  },
];
