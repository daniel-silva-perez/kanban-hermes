"use client";

import { Task, TaskStatus, Priority, Assignee } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onClick?: () => void;
  compact?: boolean;
}

const priorityDot: Record<Priority, string> = {
  low: "bg-[var(--muted)]",
  medium: "bg-[var(--warning)]",
  high: "bg-[var(--danger)]",
  urgent: "bg-[var(--danger)] animate-pulse",
};

const assigneeLabel: Record<Assignee, string> = {
  danny: "D",
  hermes: "H",
  both: "B",
};

const assigneeColor: Record<Assignee, string> = {
  danny: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  hermes: "bg-purple-500/15 text-purple-500 border-purple-500/20",
  both: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
};

export function TaskCard({ task, isDragging, dragHandleProps, onClick, compact }: TaskCardProps) {
  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
          <h4 className={`font-medium leading-snug truncate ${compact ? "text-sm" : "text-[13px]"}`}>
            {task.title}
          </h4>
        </div>
        <span className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-medium border ${assigneeColor[task.assignee]}`}>
          {assigneeLabel[task.assignee]}
        </span>
      </div>

      {!compact && (
        <p className="mt-1.5 text-[12px] text-[var(--muted)] leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2">
        {task.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-[var(--muted)] bg-[var(--muted-bg)] px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <div
      {...(dragHandleProps || {})}
      onClick={onClick}
      className={`
        group rounded-lg border bg-[var(--card)] p-3 
        hover:border-[var(--foreground)] transition-all duration-200
        active:scale-[0.98] cursor-pointer select-none
        ${isDragging ? "opacity-50 rotate-2 shadow-lg" : "border-[var(--border)] shadow-sm"}
      `}
    >
      {cardContent}
    </div>
  );
}
