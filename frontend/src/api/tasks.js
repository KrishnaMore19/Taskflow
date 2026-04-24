// src/api/tasks.js
// Task API calls: CRUD operations and stats

import api from "./axios";

// Get all tasks for the current user with optional filters
export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

// Get a single task by ID
export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// Create a new task
export const createTask = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

// Update all fields of a task
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

// Update only the status of a task
export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

// Delete a task by ID
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Get task statistics for the dashboard
export const getTaskStats = async () => {
  const response = await api.get("/tasks/stats");
  return response.data;
};
