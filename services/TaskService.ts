import { API_CONFIG } from "@/services/ApiConfig";
import { Task } from "@/types/types";
import { getToken } from "@/services/auth";

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
}

function authHeaders(token: string) {
  return {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllTasks(): Promise<Task[]> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks`, {
    method: "GET",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks.");
  }
  return response.json();
}

export async function getIncompleteTasks(): Promise<Task[]> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/incomplete`, {
    method: "GET",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch incomplete tasks.");
  }
  return response.json();
}

export async function createTask(data: CreateTaskDTO): Promise<Task> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create task.");
  }
  return response.json();
}

export async function updateTask(taskId: number, updateData: Partial<Task>): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error("Failed to update task.");
  }
}

export async function deleteTask(taskId: number): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to delete task.");
  }
}

export async function linkTaskToTimeBlock(taskId: number, timeblockId: string): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/${taskId}/link/${timeblockId}`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to link task to time block.");
  }
}

export async function unlinkTaskFromTimeBlock(taskId: number): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("No auth token found.");
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/${taskId}/unlink`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to unlink task from time block.");
  }
}