"use client";

import { useState, useMemo } from "react";
import { INITIAL_TASKS, COLUMNS, PROJECTS, Task, TaskStatus } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";

type Tab = "board" | "suggestions";
type Filter = { project: string; assignee: string; priority: string };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [filter, setFilter] = useState<Filter>({ project: "all", assignee: "all", priority: "all" });
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>("backlog");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter.project !== "all" && t.project !== filter.project) return false;
      if (filter.assignee !== "all" && t.assignee !== filter.assignee) return false;
      if (filter.priority !== "all" && t.priority !== filter.priority) return false;
      return true;
    });
  }, [tasks, filter]);

  const suggestionTasks = useMemo(
    () => filteredTasks.filter((t) => t.tags.includes("social-proof")),
    [filteredTasks]
  );

  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      ready: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    filteredTasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [filteredTasks]);

  function moveTask(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString().slice(0, 10) } : t)));
  }

  const activeColumn = COLUMNS.find((c) => c.id === mobileColumn)!;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h1 className="text-sm font-semibold tracking-tight hidden sm:block">Kanban</h1>
            </div>
            <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
            <div className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-blue-500/15 text-blue-500 font-medium">D</span>
              <span>+</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-purple-500/15 text-purple-500 font-medium">H</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[var(--muted-bg)] rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("board")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "board" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "suggestions" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Suggestions
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[var(--danger)]/10 text-[var(--danger)] text-[10px] px-1">
                {suggestionTasks.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-[var(--muted)] shrink-0">Filter:</span>
          <select
            value={filter.project}
            onChange={(e) => setFilter((f) => ({ ...f, project: e.target.value }))}
            className="text-xs bg-transparent border border-[var(--border)] rounded-md px-2 py-1 text-[var(--foreground)] outline-none focus:border-[var(--foreground)] shrink-0"
          >
            <option value="all">All projects</option>
            {PROJECTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filter.assignee}
            onChange={(e) => setFilter((f) => ({ ...f, assignee: e.target.value }))}
            className="text-xs bg-transparent border border-[var(--border)] rounded-md px-2 py-1 text-[var(--foreground)] outline-none focus:border-[var(--foreground)] shrink-0"
          >
            <option value="all">All assignees</option>
            <option value="danny">Danny</option>
            <option value="hermes">Hermes</option>
            <option value="both">Both</option>
          </select>
          <select
            value={filter.priority}
            onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value }))}
            className="text-xs bg-transparent border border-[var(--border)] rounded-md px-2 py-1 text-[var(--foreground)] outline-none focus:border-[var(--foreground)] shrink-0"
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(filter.project !== "all" || filter.assignee !== "all" || filter.priority !== "all") && (
            <button
              onClick={() => setFilter({ project: "all", assignee: "all", priority: "all" })}
              className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-2 shrink-0"
            >
              Clear
            </button>
          )}
          <div className="ml-auto text-[11px] text-[var(--muted)] shrink-0">
            {filteredTasks.length} tasks
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "board" ? (
        <>
          {/* Desktop: Kanban columns */}
          <div className="hidden md:flex flex-1 overflow-x-auto overflow-y-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex gap-4 min-w-full">
              {COLUMNS.map((col) => (
                <div key={col.id} className="flex-1 min-w-[260px] max-w-[320px] flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                      <h2 className="text-xs font-semibold uppercase tracking-wider">{col.label}</h2>
                    </div>
                    <span className="text-[11px] text-[var(--muted)] bg-[var(--muted-bg)] px-1.5 py-0.5 rounded">
                      {tasksByColumn[col.id].length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto kanban-scroll space-y-2 pb-4">
                    {tasksByColumn[col.id].map((task) => (
                      <TaskCard key={task.id} task={task} onStatusChange={moveTask} compact />
                    ))}
                    {tasksByColumn[col.id].length === 0 && (
                      <div className="text-center py-8 text-[11px] text-[var(--muted)] border border-dashed border-[var(--border)] rounded-lg">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Single column with picker */}
          <div className="md:hidden flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-[var(--border)] px-4 py-2 flex items-center gap-2 overflow-x-auto">
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
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: mobileColumn === col.id ? "var(--background)" : col.color }} />
                  {col.label}
                  <span className={`text-[10px] ${mobileColumn === col.id ? "text-[var(--background)]/70" : "text-[var(--muted)]"}`}>
                    {tasksByColumn[col.id].length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto kanban-scroll px-4 py-3 space-y-2">
              {tasksByColumn[mobileColumn].map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={moveTask} />
              ))}
              {tasksByColumn[mobileColumn].length === 0 && (
                <div className="text-center py-12 text-sm text-[var(--muted)]">
                  No tasks in {activeColumn.label}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Suggestions tab */
        <div className="flex-1 overflow-y-auto kanban-scroll">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium tracking-tight">Suggestions</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Ideas and improvements proposed by Hermes for Danny&apos;s projects. Approve, reject, or move to the board.
              </p>
            </div>
            {suggestionTasks.length === 0 ? (
              <div className="text-center py-16 text-sm text-[var(--muted)] border border-dashed border-[var(--border)] rounded-xl">
                No suggestions match current filters.
              </div>
            ) : (
              <div className="space-y-3">
                {suggestionTasks.map((task) => (
                  <div key={task.id} className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 hover:border-[var(--foreground)] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{task.project}</span>
                          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            task.priority === "high" || task.priority === "urgent"
                              ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                              : "bg-[var(--warning)]/10 text-[var(--warning)]"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium">{task.title}</h3>
                        <p className="mt-1.5 text-[13px] text-[var(--muted)] leading-relaxed">{task.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-[10px] bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium ${
                          task.assignee === "danny" ? "bg-blue-500/15 text-blue-500" :
                          task.assignee === "hermes" ? "bg-purple-500/15 text-purple-500" :
                          "bg-emerald-500/15 text-emerald-500"
                        }`}>
                          {task.assignee === "danny" ? "D" : task.assignee === "hermes" ? "H" : "B"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2">
                      <button
                        onClick={() => moveTask(task.id, "ready")}
                        className="text-xs bg-[var(--foreground)] text-[var(--background)] px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity"
                      >
                        Approve → Ready
                      </button>
                      <button
                        onClick={() => moveTask(task.id, "backlog")}
                        className="text-xs border border-[var(--border)] text-[var(--foreground)] px-3 py-1.5 rounded-md hover:bg-[var(--muted-bg)] transition-colors"
                      >
                        Move to Backlog
                      </button>
                      <button
                        onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                        className="text-xs text-[var(--muted)] hover:text-[var(--danger)] px-2 py-1.5 transition-colors ml-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
