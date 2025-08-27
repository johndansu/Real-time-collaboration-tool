import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
    projects: string[];
  };
  token: string;
  message: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
    projects: string[];
  };
  token: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  projects: string[];
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get("/auth/profile");
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to get profile");
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${data.id}`, data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  }
}

export const authService = new AuthService();
