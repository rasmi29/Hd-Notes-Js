export interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  statusCode?: number;
  data?: {
    user?: User;
    token?: string;
  };
  message?: string;
  success?: boolean;
  user?: User; 
  token?: string; 
  _id?: string; 
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
