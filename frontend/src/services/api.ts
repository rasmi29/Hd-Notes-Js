import axios from "axios";
import type {
  AuthResponse,
  SignUpData,
  SignInData,
  OTPVerificationData,
  CreateNoteData,
  Note,
} from "../types/index.ts";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  verifyOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post("/auth/signin", data);
    return response.data;
  },

  verifySignInOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
    const response = await api.post("/auth/signin/verify-otp", data);
    return response.data;
  },

  resendOTP: async (userId: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/resend-otp", { userId });
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  getAllNotes: async (): Promise<{ notes: Note[]; count: number }> => {
    const response = await api.get("/note/all");
    return response.data;
  },

  createNote: async (data: CreateNoteData): Promise<{ note: Note }> => {
    const response = await api.post("/note/create", data);
    return response.data;
  },

  getNote: async (noteId: string): Promise<{ note: Note }> => {
    const response = await api.get(`/note/${noteId}`);
    return response.data;
  },

  deleteNote: async (noteId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/note/${noteId}`);
    return response.data;
  },
};
