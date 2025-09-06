// src/services/api.ts
import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
// REMOVED: import { useAuth } from "../context/AuthContext"; - No longer needed

import type {
  AuthResponse,
  SignUpData,
  SignInData,
  OTPVerificationData,
  CreateNoteData,
  Note,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useApi = () => {
  // REMOVED: const { token } = useAuth(); - This was causing the timing issue

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Attach token safely - CHANGED: Always get token directly from localStorage
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    let authToken = null; // CHANGED: Start with null instead of token from context

    // CHANGED: Always check localStorage directly for the most current token
    const stored = localStorage.getItem("hdnotes_auth");
    if (stored) {
      try {
        authToken = JSON.parse(stored).token;
      } catch {
        // If parsing fails, keep authToken as null
      }
    }

    if (authToken) {
      // Ensure headers exist
      config.headers = config.headers ?? {};
      // Assign token
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  });

  // ADDED: Response interceptor to handle nested data property
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // If the response has a nested data property, extract it
      if (response.data && typeof response.data === 'object' && response.data.data !== undefined) {
        return {
          ...response,
          data: response.data.data
        };
      }
      return response;
    },
    (error) => {
      // Optional: Add error logging here if needed
      return Promise.reject(error);
    }
  );

  // Auth API
  const authAPI = {
    signUp: async (data: SignUpData): Promise<AuthResponse> => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    verifyOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
      const response = await api.post("/auth/verify-otp", data);
      return response.data;
    },
    signIn: async (data: SignInData): Promise<AuthResponse> => {
      const response = await api.post("/auth/send-otp", data);
      return response.data;
    },
    verifySignInOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
      const response = await api.post("/auth/verify-otp", data);
      return response.data;
    },
    resendOTP: async (email: string): Promise<AuthResponse> => {
      const response = await api.post("/auth/send-otp", { email });
      return response.data;
    },
  };

  // Notes API
  const notesAPI = {
    getAllNotes: async (): Promise<{ notes: Note[]; count: number }> => {
      const response = await api.get("/note/all");
      return response.data;
    },
    createNote: async (data: CreateNoteData): Promise<{ note: Note }> => {
      const response = await api.post("/note/create", data);
      return { note: response.data };
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

  return { authAPI, notesAPI };
};