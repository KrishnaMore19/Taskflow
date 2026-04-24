// src/components/TaskCard.jsx
// Editorial redesign — warm white, jet black, vermillion accent (matches Landing)

import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Pencil, Trash2, Calendar, Flag, Timer } from "lucide-react";

const PRIORITY_COLORS = {
  low:    { color: "#16A34A", bg: "rgba(22,163,74,0.08)" },
  medium: { color: "#D97706", bg: "rgba(217,119,6,0.08)" },
  high:   { color: "#E84025", bg: "rgba(232,64,37,0.08)" },
};

const STATUS_CYCLE   = { pending: "in_progress", in_progress: "completed", completed: "pending" };
const STATUS_LABELS  = { pending: "Pending", in_progress: "In Progress", completed: "Completed" };

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [hovered, setHovered]             = useState(false);

  const handleStatusToggle = async () => {
    setStatusLoading(true);
    try { await onStatusChange(task.id, STATUS_CYCLE[task.status]); }
    finally { setStatusLoading(false); }
  };

  const handleDelete = () => {
    if (deleteConfirm) { onDelete(task.id); }
    else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "completed") return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const isCompleted = task.status === "completed";
  const pc          = PRIORITY_COLORS[task.priority];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "1rem 1.25rem",
        background: "#FAFAF7",
        border: "1.5px solid #E5E2DC",
        boxShadow: hovered ? "4px 5px 0px #0A0A0A" : "2px 3px 0px #0A0A0A",
        transform: hovered ? "translate(-2px, -2px)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        opacity: isCompleted ? 0.72 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>

        {/* Status toggle */}
        <button
          onClick={handleStatusToggle}
          disabled={statusLoading}
          title={`Mark as ${STATUS_LABELS[STATUS_CYCLE[task.status]]}`}
          style={{ flexShrink: 0, background: "none", border: "none", cursor: statusLoading ? "not-allowed" : "pointer", padding: 0, marginTop: "1px", color: isCompleted ? "#16A34A" : task.status === "in_progress" ? "#2563EB" : "#A0A0A0", transition: "color 0.2s" }}
        >
          {statusLoading ? (
            <span style={{ display: "block", width: 20, height: 20, border: "2px solid #E5E2DC", borderTopColor: "#E84025", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          ) : isCompleted ? (
            <CheckCircle2 size={20} />
          ) : task.status === "in_progress" ? (
            <Timer size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.4, color: isCompleted ? "#A0A0A0" : "#0A0A0A", textDecoration: isCompleted ? "line-through" : "none", flex: 1 }}>
              {task.title}
            </h3>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", opacity: hovered ? 1 : 0, transition: "opacity 0.2s", flexShrink: 0 }}>
              <button
                onClick={() => onEdit(task)}
                title="Edit task"
                style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid transparent", cursor: "pointer", color: "#A0A0A0", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#E5E2DC"; e.currentTarget.style.color = "#0A0A0A"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#A0A0A0"; }}
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={handleDelete}
                title={deleteConfirm ? "Click again to confirm" : "Delete task"}
                style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: deleteConfirm ? "rgba(232,64,37,0.08)" : "none", border: `1.5px solid ${deleteConfirm ? "#E84025" : "transparent"}`, cursor: "pointer", color: deleteConfirm ? "#E84025" : "#A0A0A0", transition: "all 0.15s" }}
                onMouseEnter={e => { if (!deleteConfirm) { e.currentTarget.style.borderColor = "#E5E2DC"; e.currentTarget.style.color = "#E84025"; } }}
                onMouseLeave={e => { if (!deleteConfirm) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#A0A0A0"; } }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#5A5A5A", lineHeight: 1.6, marginTop: "0.35rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem" }}>

            {/* Status badge */}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem", border: "1px solid", borderColor: task.status === "completed" ? "#16A34A" : task.status === "in_progress" ? "#2563EB" : "#D8D4CE", color: task.status === "completed" ? "#16A34A" : task.status === "in_progress" ? "#2563EB" : "#5A5A5A", background: "transparent" }}>
              {STATUS_LABELS[task.status]}
            </span>

            {/* Priority badge */}
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem", background: pc.bg, color: pc.color, border: "none" }}>
              <Flag size={9} />
              {task.priority}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: isOverdue() ? "#E84025" : "#A0A0A0", letterSpacing: "0.05em" }}>
                <Calendar size={10} />
                {formatDate(task.dueDate)}
                {isOverdue() && " · overdue"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm tooltip */}
      {deleteConfirm && (
        <div style={{ position: "absolute", top: "-2.5rem", right: 0, background: "#E84025", color: "#FAFAF7", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.05em", padding: "0.4rem 0.75rem", whiteSpace: "nowrap", boxShadow: "2px 3px 0px rgba(0,0,0,0.3)" }}>
          Click again to confirm
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default TaskCard;