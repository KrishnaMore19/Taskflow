// src/components/TaskModal.jsx
// Editorial redesign — warm white, jet black, vermillion accent (matches Landing)

import React, { useState, useEffect } from "react";
import { X, Calendar, Flag, AlignLeft, Type, CheckSquare } from "lucide-react";

const PRIORITIES = [
  { value: "low",    label: "Low",    activeStyle: { background: "#16A34A", color: "#FAFAF7", borderColor: "#16A34A" } },
  { value: "medium", label: "Medium", activeStyle: { background: "#D97706", color: "#FAFAF7", borderColor: "#D97706" } },
  { value: "high",   label: "High",   activeStyle: { background: "#E84025", color: "#FAFAF7", borderColor: "#E84025" } },
];

const STATUSES = [
  { value: "pending",     label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed",   label: "Completed" },
];

const TaskModal = ({ isOpen, onClose, onSave, task = null, defaultStatus = "pending" }) => {
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: "", description: "", priority: "medium", dueDate: "", status: defaultStatus,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title:       task.title || "",
        description: task.description || "",
        priority:    task.priority || "medium",
        dueDate:     task.due_date || task.dueDate || "",
        status:      task.status || "pending",
      });
    } else {
      setFormData({ title: "", description: "", priority: "medium", dueDate: "", status: defaultStatus });
    }
    setErrors({});
  }, [task, isOpen, defaultStatus]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (formData.title.length > 200) errs.title = "Title must be under 200 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSave({
        title:       formData.title.trim(),
        description: formData.description.trim(),
        priority:    formData.priority,
        dueDate:     formData.dueDate || null,
        status:      formData.status,
      });
    } catch { /* parent handles */ } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    background: "#FAFAF7", border: "1.5px solid #D8D4CE",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.85rem", color: "#0A0A0A", outline: "none",
  };

  const labelStyle = {
    display: "flex", alignItems: "center", gap: "0.4rem",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
    letterSpacing: "0.15em", textTransform: "uppercase", color: "#5A5A5A",
    marginBottom: "0.5rem",
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(10,10,10,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div style={{ width: "100%", maxWidth: 460, background: "#FAFAF7", border: "1.5px solid #0A0A0A", boxShadow: "6px 8px 0px #0A0A0A" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1.5px solid #E5E2DC" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E84025", marginBottom: "0.2rem" }}>
              {isEditing ? "01 — Edit" : "01 — New"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
              {isEditing ? "Edit task" : "New task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #E5E2DC", cursor: "pointer", color: "#5A5A5A", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E2DC"; e.currentTarget.style.color = "#5A5A5A"; }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Title */}
          <div>
            <label style={labelStyle}><Type size={10} /> Title</label>
            <input
              type="text" name="title" value={formData.title}
              onChange={handleChange} placeholder="What needs to be done?" autoFocus
              style={{ ...inputStyle, borderColor: errors.title ? "#E84025" : "#D8D4CE" }}
              onFocus={e => { e.target.style.borderColor = "#E84025"; }}
              onBlur={e => { e.target.style.borderColor = errors.title ? "#E84025" : "#D8D4CE"; }}
            />
            {errors.title && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#E84025", marginTop: "0.35rem" }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              <AlignLeft size={10} /> Description
              <span style={{ color: "#A0A0A0", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              name="description" value={formData.description} onChange={handleChange}
              placeholder="Add more details…" rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = "#E84025"; }}
              onBlur={e => { e.target.style.borderColor = "#D8D4CE"; }}
            />
          </div>

          {/* Status — edit only */}
          {isEditing && (
            <div>
              <label style={labelStyle}><CheckSquare size={10} /> Status</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {STATUSES.map(s => (
                  <button
                    key={s.value} type="button"
                    onClick={() => setFormData(p => ({ ...p, status: s.value }))}
                    style={{
                      flex: 1, padding: "0.6rem 0.5rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem", letterSpacing: "0.08em",
                      textTransform: "uppercase", cursor: "pointer",
                      border: "1.5px solid",
                      borderColor: formData.status === s.value ? "#0A0A0A" : "#E5E2DC",
                      background: formData.status === s.value ? "#0A0A0A" : "transparent",
                      color: formData.status === s.value ? "#FAFAF7" : "#5A5A5A",
                      transition: "all 0.15s",
                    }}
                  >{s.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Priority + Due Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}><Flag size={10} /> Priority</label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {PRIORITIES.map(({ value, label, activeStyle }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setFormData(p => ({ ...p, priority: value }))}
                    style={{
                      flex: 1, padding: "0.5rem 0",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem", letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: "pointer",
                      border: "1.5px solid",
                      transition: "all 0.15s",
                      ...(formData.priority === value ? activeStyle : { borderColor: "#E5E2DC", background: "transparent", color: "#A0A0A0" }),
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}><Calendar size={10} /> Due date</label>
              <input
                type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                style={{ ...inputStyle, fontSize: "0.8rem", color: formData.dueDate ? "#0A0A0A" : "#A0A0A0" }}
                onFocus={e => { e.target.style.borderColor = "#E84025"; }}
                onBlur={e => { e.target.style.borderColor = "#D8D4CE"; }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", borderTop: "1.5px solid #E5E2DC", marginTop: "0.25rem", paddingTop: "1rem" }}>
            <button
              type="button" onClick={onClose}
              style={{ flex: 1, padding: "0.85rem", background: "transparent", border: "1.5px solid #D8D4CE", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#5A5A5A", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.color = "#0A0A0A"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#D8D4CE"; e.currentTarget.style.color = "#5A5A5A"; }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              style={{ flex: 1, padding: "0.85rem", background: loading ? "#C0BAB0" : "#E84025", border: `1.5px solid ${loading ? "#C0BAB0" : "#E84025"}`, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#FAFAF7", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(250,250,247,0.3)", borderTopColor: "#FAFAF7", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Saving…
                </>
              ) : isEditing ? "Save changes →" : "Create task →"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
    @keyframes spin { to { transform: rotate(360deg); } }
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.5;
      filter: invert(0);
    }
    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
  `}</style>
    </div>
  );
};

export default TaskModal;