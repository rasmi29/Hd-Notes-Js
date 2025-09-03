// src/services/api.ts
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuth } from "../context/AuthContext";

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
  const { token } = useAuth();

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Attach token safely
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    let authToken = token;

    const stored = localStorage.getItem("hdnotes_auth");
    if (!authToken && stored) {
      try {
        authToken = JSON.parse(stored).token;
      } catch {}
    }

    if (authToken) {
      // Ensure headers exist
      config.headers = config.headers ?? {};
      // Assign token
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
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

  return { authAPI, notesAPI };
};