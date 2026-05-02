"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { INITIAL_TASKS, COLUMNS, PROJECTS, Task, TaskStatus, Project } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";

// --- Sortable Task Wrapper ---
function SortableTask({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onClick={onClick}
      />
    </div>
  );
}

// --- Column Component ---
function KanbanColumn({
  column,
  tasks,
  onTaskClick,
}: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: column.color }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider">{column.label}</h3>
        </div>
        <span className="text-[11px] text-[var(--muted)] bg-[var(--muted-bg)] px-1.5 py-0.5 rounded font-medium">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-2 min-h-[120px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center py-8 text-[11px] text-[var(--muted)] border border-dashed border-[var(--border)] rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

// --- Mobile Column View ---
function MobileColumnView({
  activeColumn,
  tasks,
  onTaskClick,
  onMoveTask,
}: {
  activeColumn: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Task Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 kanban-scroll">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layoutId={task.id}
            onClick={() => setSelectedTask(task)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16 text-sm text-[var(--muted)]">
            No tasks in this column
          </div>
        )}
      </div>

      {/* Bottom Sheet for Task Actions */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[var(--card)] border-t border-[var(--border)] rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto"
          >
            <div className="p-4">
              {/* Handle */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
              </div>

              <h3 className="text-base font-semibold">{selectedTask.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{selectedTask.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedTask.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mb-2">Move to</p>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMNS.filter((c) => c.id !== selectedTask.status).map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onMoveTask(selectedTask.id, col.id);
                        setSelectedTask(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--muted-bg)] transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="mt-4 w-full py-3 rounded-xl bg-[var(--muted-bg)] text-sm font-medium hover:bg-[var(--border)] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {selectedTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTask(null)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </div>
  );
}

// --- Main App ---
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeProject, setActiveProject] = useState<string>("daniel-search");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>("suggestions");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const activeProjectData = PROJECTS.find((p) => p.id === activeProject)!;

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project === activeProject),
    [tasks, activeProject]
  );

  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      suggestions: [],
      ready: [],
      "in-progress": [],
      review: [],
      completed: [],
    };
    projectTasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [projectTasks]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task;
    if (task) setActiveDragTask(task);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const columnIds = COLUMNS.map((c) => c.id);
    if (columnIds.includes(overId as TaskStatus)) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: overId as TaskStatus, updatedAt: new Date().toISOString().slice(0, 10) } : t))
      );
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: overTask.status, updatedAt: new Date().toISOString().slice(0, 10) } : t))
      );
    }
  }, [tasks]);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString().slice(0, 10) } : t))
    );
  }, []);

  const projectTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROJECTS.forEach((p) => {
      counts[p.id] = tasks.filter((t) => t.project === p.id).length;
    });
    return counts;
  }, [tasks]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--card)] shrink-0">
        {/* Workspace Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Kanban</h1>
              <p className="text-[10px] text-[var(--muted)]">Danny + Hermes</p>
            </div>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium">Projects</span>
          </div>
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md text-left transition-colors ${
                activeProject === project.id
                  ? "bg-[var(--muted-bg)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="text-sm">{project.icon}</span>
              <span className="text-[13px] flex-1 truncate">#{project.name}</span>
              {projectTaskCounts[project.id] > 0 && (
                <span className="text-[10px] text-[var(--muted)] bg-[var(--muted-bg)] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {projectTaskCounts[project.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-blue-500/15 text-blue-500 font-medium text-[9px]">D</span>
            <span>+</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-purple-500/15 text-purple-500 font-medium text-[9px]">H</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-[var(--card)] border-r border-[var(--border)] z-50 flex flex-col"
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold">Kanban</h1>
                    <p className="text-[10px] text-[var(--muted)]">Danny + Hermes</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-[var(--muted-bg)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-3 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium">Projects</span>
                </div>
                {PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveProject(project.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 mx-2 rounded-md text-left transition-colors ${
                      activeProject === project.id
                        ? "bg-[var(--muted-bg)] text-[var(--foreground)]"
                        : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span className="text-base">{project.icon}</span>
                    <span className="text-sm flex-1 truncate">#{project.name}</span>
                    {projectTaskCounts[project.id] > 0 && (
                      <span className="text-[11px] text-[var(--muted)] bg-[var(--muted-bg)] px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {projectTaskCounts[project.id]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur z-10">
          <div className="flex items-center gap-3 px-4 h-14">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-md hover:bg-[var(--muted-bg)] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            {/* Channel Header */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg shrink-0">{activeProjectData.icon}</span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold truncate">#{activeProjectData.name}</h2>
                <p className="text-[10px] text-[var(--muted)] truncate hidden sm:block">{activeProjectData.description}</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          </div>

          {/* Mobile Column Pills */}
          <div className="md:hidden flex items-center gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-none">
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                onClick={() => setMobileColumn(col.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                  mobileColumn === col.id
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--muted-bg)] text-[var(--muted)]"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mobileColumn === col.id ? "var(--background)" : col.color }} />
                {col.label}
                <span className={mobileColumn === col.id ? "text-[var(--background)]/70" : ""}>
                  {tasksByColumn[col.id].length}
                </span>
              </button>
            ))}
          </div>
        </header>

        {/* Kanban Board - Desktop */}
        <div className="hidden md:flex flex-1 overflow-x-auto overflow-y-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-5 p-5 min-w-full">
              {COLUMNS.map((col) => (
                <div key={col.id} id={col.id} data-column={col.id}>
                  <KanbanColumn
                    column={col}
                    tasks={tasksByColumn[col.id]}
                    onTaskClick={(task) => console.log("Task clicked:", task)}
                  />
                </div>
              ))}
            </div>
            <DragOverlay>
              {activeDragTask ? <TaskCard task={activeDragTask} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Mobile Column View */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
          <MobileColumnView
            activeColumn={mobileColumn}
            tasks={tasksByColumn[mobileColumn]}
            onTaskClick={(task) => console.log("Task clicked:", task)}
            onMoveTask={moveTask}
          />
        </div>
      </main>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTaskModal(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] max-h-[80vh] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-5">
                <h3 className="text-base font-semibold">New Task</h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">in #{activeProjectData.name}</p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">Title</label>
                    <input
                      type="text"
                      placeholder="Task title..."
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent text-sm outline-none focus:border-[var(--foreground)]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">Description</label>
                    <textarea
                      rows={3}
                      placeholder="What needs to be done?"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent text-sm outline-none focus:border-[var(--foreground)] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">Priority</label>
                      <select className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent text-sm outline-none focus:border-[var(--foreground)]">
                        <option>low</option>
                        <option>medium</option>
                        <option>high</option>
                        <option>urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">Assignee</label>
                      <select className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent text-sm outline-none focus:border-[var(--foreground)]">
                        <option value="danny">Danny</option>
                        <option value="hermes">Hermes</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted-bg)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
