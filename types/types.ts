export interface TimeBlock {
  id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isFocus: boolean;
  tasks: Task[];
}

// Type for a task as returned by the backend.
export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
}

export interface Friendship {
  id: number;
  userId: string;
  friendId: string;
  friendUsername: string;
  status: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiResponse {
  status: string;
  message: string;
}

export interface UpdateXPResponse {
  message: string;
  xp: number;
  level: number;
}

export interface UpdateXPError {
  errors: string[];
}
