// src/pages/Dashboard.jsx — Fully Responsive

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, ListTodo, Clock, Search, User, AlertCircle, LayoutGrid, List, X, Grip, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask, getTaskStats } from "../api/tasks";
import TaskModal from "../components/TaskModal";

const T = {
  bg: "#FAFAF7", black: "#0A0A0A", red: "#E84025",
  border: "#E5E2DC", muted: "#5A5A5A", subtle: "#A0A0A0",
  mono: "'JetBrains Mono', monospace",
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
};

const PriorityBadge = ({ priority }) => {
  const map = { high: { color: "#E84025", bg: "rgba(232,64,37,0.08)" }, medium: { color: "#D97706", bg: "rgba(217,119,6,0.08)" }, low: { color: "#16A34A", bg: "rgba(22,163,74,0.08)" } };
  const s = map[priority] || map.low;
  return <span style={{ fontFamily: T.mono, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem", background: s.bg, color: s.color }}>{priority}</span>;
};

const DueChip = ({ due_date, status }) => {
  if (!due_date) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due   = new Date(due_date + "T00:00:00");
  const over  = due < today && status !== "completed";
  const fmt   = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: T.mono, fontSize: "0.55rem", color: over ? T.red : T.subtle, letterSpacing: "0.05em" }}>
      <Clock size={10} />{fmt}{over ? " · overdue" : ""}
    </span>
  );
};

const KanbanCard = ({ task, onEdit, onDelete, onDragStart, onDragEnd, onTouchStart, onTouchEnd }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task)} onDragEnd={onDragEnd}
      onTouchStart={e => onTouchStart(e, task)} onTouchEnd={onTouchEnd}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ touchAction: "none", position: "relative", background: T.bg, border: "1.5px solid #E5E2DC", padding: "1rem 1.1rem", cursor: "grab", userSelect: "none", transition: "transform 0.15s, box-shadow 0.15s", transform: hov ? "translate(-2px,-2px)" : "none", boxShadow: hov ? "4px 5px 0px #0A0A0A" : "2px 3px 0px #0A0A0A" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.6rem" }}>
        <Grip size={13} style={{ color: hov ? T.muted : "#D8D4CE", flexShrink: 0, marginTop: 2, transition: "color 0.15s" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", opacity: hov ? 1 : 0, transition: "opacity 0.15s" }}>
          <button onClick={() => onEdit(task)} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: T.muted, fontSize: "0.75rem", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.black; e.currentTarget.style.color = T.black; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}>✎</button>
          <button onClick={() => onDelete(task.id)} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: T.muted, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.red; e.currentTarget.style.background = "rgba(232,64,37,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "none"; }}>
            <X size={11} /></button>
        </div>
      </div>
      <p style={{ fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 500, lineHeight: 1.4, color: task.status === "completed" ? T.subtle : T.black, textDecoration: task.status === "completed" ? "line-through" : "none", marginBottom: "0.5rem" }}>{task.title}</p>
      {task.description && <p style={{ fontFamily: T.sans, fontSize: "0.75rem", fontWeight: 300, color: T.muted, lineHeight: 1.6, marginBottom: "0.6rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.description}</p>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginTop: "auto" }}>
        <PriorityBadge priority={task.priority} />
        <DueChip due_date={task.due_date} status={task.status} />
      </div>
    </div>
  );
};

const COLUMNS = [
  { id: "pending",     label: "Pending",     dotColor: "#A0A0A0", lineColor: "#A0A0A0" },
  { id: "in_progress", label: "In Progress", dotColor: "#2563EB", lineColor: "#2563EB" },
  { id: "completed",   label: "Completed",   dotColor: "#16A34A", lineColor: "#16A34A" },
];

const KanbanColumn = ({ column, tasks, draggingTask, touchOverColumn, onDragStart, onDragEnd, onTouchStart, onTouchEnd, onDrop, onEdit, onDelete, onAddClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const isTouchOver = touchOverColumn === column.id;
  const active = isDragOver || isTouchOver;

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", paddingBottom: "0.75rem", borderBottom: `2px solid ${column.lineColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: column.dotColor }} />
          <span style={{ fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: column.dotColor, fontWeight: 500 }}>{column.label}</span>
          <span style={{ fontFamily: T.mono, fontSize: "0.6rem", color: T.subtle }}>{tasks.length}</span>
        </div>
        <button onClick={() => onAddClick(column.id)}
          style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: T.subtle, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.red; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.subtle; }}
          title={`Add to ${column.label}`}><Plus size={13} /></button>
      </div>
      <div
        data-column-id={column.id}
        onDragOver={e => { e.preventDefault(); if (draggingTask?.status !== column.id) setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); if (draggingTask?.status !== column.id) onDrop(draggingTask, column.id); }}
        style={{ flex: 1, minHeight: 180, padding: "0.75rem", border: `2px dashed ${active ? column.dotColor : "transparent"}`, background: active ? `rgba(${column.id === "in_progress" ? "37,99,235" : column.id === "completed" ? "22,163,74" : "10,10,10"},0.04)` : "transparent", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "0.6rem" }}
      >
        {tasks.length === 0 && !active && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 0", color: T.subtle }}>
            <div style={{ width: 36, height: 36, border: "1.5px solid #E5E2DC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
              <ListTodo size={16} style={{ color: T.subtle }} />
            </div>
            <p style={{ fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#C0BAB0" }}>Drop tasks here</p>
          </div>
        )}
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete}
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
        ))}
        {active && (
          <div style={{ height: 56, border: "2px dashed #E84025", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: T.mono, fontSize: "0.6rem", color: T.red, letterSpacing: "0.1em" }}>Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ListRow = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [hov, setHov] = useState(false);
  const statusNext  = { pending: "in_progress", in_progress: "completed", completed: "pending" };
  const statusLabel = { pending: "Pending", in_progress: "In Progress", completed: "Done" };
  const statusStyle = {
    pending:     { color: T.muted,   border: "#D8D4CE" },
    in_progress: { color: "#2563EB", border: "#2563EB" },
    completed:   { color: "#16A34A", border: "#16A34A" },
  };
  const ss = statusStyle[task.status];

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1rem", background: T.bg, border: "1.5px solid", borderColor: hov ? T.black : T.border, boxShadow: hov ? "2px 3px 0px #0A0A0A" : "none", transition: "all 0.15s", flexWrap: "wrap" }}>
      <button onClick={() => onStatusChange(task.id, statusNext[task.status])}
        style={{ flexShrink: 0, fontFamily: T.mono, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid ${ss.border}`, color: ss.color, cursor: "pointer", whiteSpace: "nowrap" }}>
        {statusLabel[task.status]}
      </button>
      <p style={{ flex: 1, minWidth: 0, fontFamily: T.sans, fontSize: "0.875rem", fontWeight: 400, color: task.status === "completed" ? T.subtle : T.black, textDecoration: task.status === "completed" ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {task.title}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <PriorityBadge priority={task.priority} />
        <DueChip due_date={task.due_date} status={task.status} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", opacity: hov ? 1 : 0, transition: "opacity 0.15s" }}>
          <button onClick={() => onEdit(task)} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: T.muted, fontSize: "0.75rem" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.black; e.currentTarget.style.color = T.black; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}>✎</button>
          <button onClick={() => onDelete(task.id)} style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: T.muted, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.red; e.currentTarget.style.background = "rgba(232,64,37,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "none"; }}>
            <X size={11} /></button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Dashboard ─────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks]                 = useState([]);
  const [stats, setStats]                 = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading]             = useState(true);
  const [loadError, setLoadError]         = useState(null);
  const [view, setView]                   = useState("kanban");
  const [search, setSearch]               = useState("");
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingTask, setEditingTask]     = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("pending");
  const [draggingTask, setDraggingTask]   = useState(null);
  const [touchOverColumn, setTouchOverColumn] = useState(null);
  const touchState = useRef({ task: null, ghost: null, lastColumnId: null });

  const loadData = useCallback(async () => {
    setLoadError(null);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        getTasks({ sortBy: "createdAt", order: "DESC" }),
        getTaskStats(),
      ]);
      setTasks(Array.isArray(tasksRes?.tasks) ? tasksRes.tasks : []);
      setStats(statsRes?.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setLoadError(msg);
      toast.error(`Load failed: ${msg}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = tasks.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
  });
  const byStatus = (s) => filtered.filter(t => t.status === s);

  const handleDragStart = (e, task) => { setDraggingTask(task); e.dataTransfer.effectAllowed = "move"; };
  const handleDragEnd   = () => setDraggingTask(null);

  const handleTouchStart = useCallback((e, task) => {
    const touch = e.touches[0];
    setDraggingTask(task);
    touchState.current.task = task;
    touchState.current.lastColumnId = null;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const ghost = card.cloneNode(true);
    ghost.style.cssText = `position:fixed;pointer-events:none;z-index:9999;width:${rect.width}px;opacity:0.85;transform:scale(1.04) rotate(1.5deg);box-shadow:0 20px 60px rgba(0,0,0,0.3);transition:none;left:${touch.clientX - rect.width / 2}px;top:${touch.clientY - 40}px;`;
    document.body.appendChild(ghost);
    touchState.current.ghost = ghost;
    const onMove = (ev) => {
      ev.preventDefault();
      const t = ev.touches[0];
      const { ghost: g } = touchState.current;
      if (!g) return;
      g.style.left = `${t.clientX - rect.width / 2}px`;
      g.style.top  = `${t.clientY - 40}px`;
      g.style.display = "none";
      const el = document.elementFromPoint(t.clientX, t.clientY);
      g.style.display = "";
      const colEl = el?.closest("[data-column-id]");
      const columnId = colEl?.getAttribute("data-column-id") || null;
      touchState.current.lastColumnId = columnId;
      setTouchOverColumn(columnId);
    };
    card.addEventListener("touchmove", onMove, { passive: false });
    touchState.current.onMove = onMove;
    touchState.current.card = card;
  }, []);

  const handleTouchEnd = useCallback(async () => {
    const { task, ghost, lastColumnId, onMove, card } = touchState.current;
    if (card && onMove) card.removeEventListener("touchmove", onMove);
    touchState.current.onMove = null; touchState.current.card = null;
    if (ghost) { ghost.remove(); touchState.current.ghost = null; }
    setDraggingTask(null); setTouchOverColumn(null);
    touchState.current.task = null; touchState.current.lastColumnId = null;
    if (task && lastColumnId && task.status !== lastColumnId) await handleDrop(task, lastColumnId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = async (task, newStatus) => {
    if (task.status === newStatus) return;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try { await updateTaskStatus(task.id, newStatus); toast.success(`Moved to ${newStatus.replace("_", " ")}`); await loadData(); }
    catch { toast.error("Failed to move task"); await loadData(); }
  };

  const handleAddClick    = (status = "pending") => { setDefaultStatus(status); setEditingTask(null); setModalOpen(true); };
  const handleEdit        = (task) => { setEditingTask(task); setModalOpen(true); };
  const handleDelete      = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try { await deleteTask(taskId); toast.success("Task deleted"); await loadData(); }
    catch { toast.error("Delete failed"); await loadData(); }
  };
  const handleSaveTask    = async (formData) => {
    try {
      if (editingTask) { await updateTask(editingTask.id, formData); toast.success("Task updated"); }
      else             { await createTask({ ...formData, status: defaultStatus }); toast.success("Task created"); }
      setModalOpen(false); await loadData();
    } catch (err) { toast.error(err.response?.data?.message || err.message || "Failed to save"); throw err; }
  };
  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await updateTaskStatus(taskId, newStatus); await loadData(); }
    catch { toast.error("Status update failed"); await loadData(); }
  };
  const handleLogout = () => { logout(); navigate("/"); toast.success("Logged out"); };

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: T.bg, color: T.black }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #E84025; color: #FAFAF7; }

        .tf-search { width: 100%; padding: 0.6rem 0.85rem 0.6rem 2.2rem; background: #FAFAF7; border: 1.5px solid #E5E2DC; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; color: #0A0A0A; outline: none; transition: border-color 0.2s; }
        .tf-search::placeholder { color: #A0A0A0; }
        .tf-search:focus { border-color: #0A0A0A; }

        .view-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.75rem; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; border: none; cursor: pointer; transition: all 0.15s; }
        .view-btn.active { background: #0A0A0A; color: #FAFAF7; }
        .view-btn:not(.active) { color: #5A5A5A; }
        .view-btn:not(.active):hover { color: #0A0A0A; }

        .add-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; background: #E84025; color: #FAFAF7; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; font-weight: 600; border: 2px solid #E84025; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .add-btn:hover { background: #C93520; border-color: #C93520; }

        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* Kanban: 3 cols desktop, 1 col mobile */
        .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

        /* Stat pills: 4 across on desktop */
        .stat-pills { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.5rem; }

        /* Navbar inner */
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .nav-right  { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .nav-label  { display: inline; }

        @media (max-width: 900px) {
          .kanban-board { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .nav-inner  { padding: 0 1rem; }
          .nav-right  { gap: 0.4rem; }
          .nav-label  { display: none; }
          .view-btn   { padding: 0.45rem 0.5rem; }
          .add-btn    { padding: 0.5rem 0.75rem; font-size: 0.72rem; }
          .dash-main  { padding: 1.5rem 1rem !important; }
          .greeting-h1 { font-size: 1.8rem !important; }
        }

        @media (max-width: 400px) {
          .greeting-h1 { font-size: 1.5rem !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(250,250,247,0.95)", backdropFilter: "blur(12px)", borderBottom: "1.5px solid #E5E2DC" }}>
        <div className="nav-inner">
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, background: T.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="#FAFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: T.serif, fontWeight: 900, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>TaskFlow</span>
          </div>

          <div className="nav-right">
            {/* View toggle */}
            <div style={{ display: "flex", border: "1.5px solid #E5E2DC" }}>
              <button onClick={() => setView("kanban")} className={`view-btn${view === "kanban" ? " active" : ""}`}>
                <LayoutGrid size={13} /> <span className="nav-label">Board</span>
              </button>
              <button onClick={() => setView("list")} className={`view-btn${view === "list" ? " active" : ""}`} style={{ borderLeft: "1.5px solid #E5E2DC" }}>
                <List size={13} /> <span className="nav-label">List</span>
              </button>
            </div>

            {/* Add task */}
            <button onClick={() => handleAddClick("pending")} className="add-btn">
              <Plus size={14} /> <span className="nav-label">New Task</span>
            </button>

            {/* User + logout */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.6rem", borderLeft: "1.5px solid #E5E2DC" }}>
              <div style={{ width: 28, height: 28, border: "1.5px solid #E5E2DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={13} style={{ color: T.muted }} />
              </div>
              <button onClick={handleLogout}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.subtle, display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.red}
                onMouseLeave={e => e.currentTarget.style.color = T.subtle}>
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main className="dash-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Greeting + stats */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: T.red, marginBottom: "0.75rem" }}>
            — Good {greeting}
          </div>
          <h1 className="greeting-h1" style={{ fontFamily: T.serif, fontSize: "2.5rem", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            {user?.name?.split(" ")[0]},<br />
            <span style={{ color: "#C0BAB0" }}>let's get things done.</span>
          </h1>

          <div className="stat-pills">
            {[
              { label: "Total",       val: stats.total,      color: T.muted,   border: "#D8D4CE" },
              { label: "Pending",     val: stats.pending,    color: "#D97706", border: "#D97706" },
              { label: "In Progress", val: stats.inProgress, color: "#2563EB", border: "#2563EB" },
              { label: "Done",        val: stats.completed,  color: "#16A34A", border: "#16A34A" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.85rem", border: `1.5px solid ${s.border}` }}>
                <span style={{ fontFamily: T.serif, fontSize: "1.1rem", fontWeight: 900, color: s.color }}>{s.val}</span>
                <span style={{ fontFamily: T.mono, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "1.5px", background: T.black, marginBottom: "2rem" }} />

        {/* Error banner */}
        {loadError && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem 1.25rem", border: "1.5px solid #E84025", background: "rgba(232,64,37,0.04)", marginBottom: "1.5rem" }}>
            <AlertCircle size={14} style={{ color: T.red, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.red, marginBottom: "0.25rem" }}>Failed to load</p>
              <p style={{ fontFamily: T.mono, fontSize: "0.6rem", color: "#C0BAB0", wordBreak: "break-all" }}>{loadError}</p>
            </div>
            <button onClick={loadData} style={{ fontFamily: T.mono, fontSize: "0.6rem", color: T.red, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textDecoration: "underline", flexShrink: 0 }}>Retry</button>
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <Search size={13} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.subtle }} />
          <input type="text" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} className="tf-search" style={{ paddingLeft: "2.5rem" }} />
        </div>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: T.mono, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.red, flexShrink: 0 }}>
            {view === "kanban" ? "01 — Board" : "01 — List"}
          </span>
          <div style={{ flex: 1, height: "1px", background: T.border }} />
          {view === "kanban" && <span style={{ fontFamily: T.mono, fontSize: "0.55rem", color: "#C0BAB0", letterSpacing: "0.08em", flexShrink: 0 }}>Drag to move</span>}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="kanban-board">
            {[1,2,3].map(n => (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ height: 20, width: 80, background: "#E5E2DC", animation: "pulse 1.5s ease-in-out infinite" }} />
                {[1,2].map(m => <div key={m} style={{ height: 100, background: "#F0EDE8", border: "1.5px solid #E5E2DC", animation: "pulse 1.5s ease-in-out infinite" }} />)}
              </div>
            ))}
          </div>

        ) : view === "kanban" ? (
          <div>
            <div className="kanban-board">
              {COLUMNS.map(col => (
                <KanbanColumn key={col.id} column={col} tasks={byStatus(col.id)}
                  draggingTask={draggingTask} touchOverColumn={touchOverColumn}
                  onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                  onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
                  onDrop={handleDrop} onEdit={handleEdit} onDelete={handleDelete}
                  onAddClick={handleAddClick} />
              ))}
            </div>
            {filtered.length === 0 && !loadError && (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <div style={{ width: 48, height: 48, border: "1.5px solid #E5E2DC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <ListTodo size={22} style={{ color: "#C0BAB0" }} />
                </div>
                <p style={{ fontFamily: T.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: T.subtle, marginBottom: "1.5rem" }}>
                  {search ? "No tasks match your search" : "No tasks yet"}
                </p>
                {!search && (
                  <button onClick={() => handleAddClick("pending")} className="add-btn" style={{ margin: "0 auto" }}>
                    <Plus size={14} /> Create first task
                  </button>
                )}
              </div>
            )}
          </div>

        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {filtered.length === 0 && !loadError ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <p style={{ fontFamily: T.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: T.subtle }}>
                  {search ? "No tasks match your search" : "No tasks yet"}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: T.mono, fontSize: "0.6rem", color: "#C0BAB0", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                  {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                </p>
                {filtered.map(task => (
                  <ListRow key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                ))}
              </>
            )}
          </div>
        )}
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask} task={editingTask} defaultStatus={defaultStatus} />
    </div>
  );
};

export default Dashboard;