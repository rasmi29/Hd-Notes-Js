import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/common/Layout";
import SignUpForm from "../components/auth/SignUpForm";
import OTPVerification from "../components/auth/OTPVerification";
import { useApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { SignUpData, OTPVerificationData } from "../types";

const SignUp: React.FC = () => {
  const { authAPI } = useApi();
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    try {
      const response = await authAPI.signUp(data);
      setUserId(response._id!);
      setUserEmail(data.email);
      setStep("otp");
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  const handleOTPVerification = async (data: OTPVerificationData) => {
    try {
      const response = await authAPI.verifyOTP(data);
      login(response.token!, response.user!, () => {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "OTP verification failed");
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.resendOTP(userEmail);
      toast.success("New OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HD</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign up</h1>
          <p className="text-gray-600">Sign up to enjoy the feature of HD</p>
        </div>

        {/* Form Content */}
        {step === "signup" ? (
          <SignUpForm onSubmit={handleSignUp} />
        ) : (
          <OTPVerification
            userId={userId}
            email={userEmail}
            onSubmit={handleOTPVerification}
            onResendOTP={handleResendOTP}
            type="signup"
          />
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
