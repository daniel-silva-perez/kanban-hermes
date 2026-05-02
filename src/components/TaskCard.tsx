"use client";

import { Task, TaskStatus, Priority, Assignee } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  compact?: boolean;
}

const priorityBadge: Record<Priority, string> = {
  low: "bg-[var(--muted-bg)] text-[var(--muted)]",
  medium: "bg-[var(--warning)]/10 text-[var(--warning)]",
  high: "bg-[var(--danger)]/10 text-[var(--danger)]",
  urgent: "bg-[var(--danger)]/20 text-[var(--danger)] font-medium",
};

const assigneeLabel: Record<Assignee, string> = {
  danny: "D",
  hermes: "H",
  both: "B",
};

const assigneeColor: Record<Assignee, string> = {
  danny: "bg-blue-500/15 text-blue-500",
  hermes: "bg-purple-500/15 text-purple-500",
  both: "bg-emerald-500/15 text-emerald-500",
};

export function TaskCard({ task, onStatusChange, compact = false }: TaskCardProps) {
  if (compact) {
    return (
      <div className="group rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--foreground)] transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-snug flex-1">{task.title}</h4>
          <span className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-medium ${assigneeColor[task.assignee]}`}>
            {assigneeLabel[task.assignee]}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${priorityBadge[task.priority]}`}>
            {task.priority}
          </span>
          <span className="text-[10px] text-[var(--muted)]">{task.project}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--foreground)] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium ${assigneeColor[task.assignee]}`}>
            {assigneeLabel[task.assignee]}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed line-clamp-3">
        {task.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${priorityBadge[task.priority]}`}>
          {task.priority}
        </span>
        {task.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-[var(--muted)] bg-[var(--muted-bg)] px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--muted)]">{task.project}</span>
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-[11px] bg-transparent border border-[var(--border)] rounded px-2 py-1 text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
          >
            <option value="backlog">Backlog</option>
            <option value="ready">Ready</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        )}
      </div>
    </div>
  );
}
