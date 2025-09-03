import axios from "axios";
import { useAuth } from "../context/AuthContext";
import type {
  AuthResponse,
  SignUpData,
  SignInData,
  OTPVerificationData,
  CreateNoteData,
  Note,
} from "../types/index.ts";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useApi = () => {
  const { token, login, logout, user } = useAuth();

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ send refresh token cookie
  });

  // attach access token
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // handle refresh / errors
  api.interceptors.response.use(
    (response) => {
      // ✅ backend sends new access token in headers
      const newAccessToken = response.headers["authorization"]?.split(" ")[1];
      if (newAccessToken && user) {
        login(newAccessToken, user); // update context
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    }
  );

  //auth API
  
  const authAPI = {
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

  //notes api
  
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