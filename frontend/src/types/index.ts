export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  userId?: string;
}

export interface SignUpData {
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface SignInData {
  email: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface ApiError {
  error: string;
  details?: any[];
}