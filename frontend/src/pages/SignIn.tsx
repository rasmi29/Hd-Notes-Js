import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Layout from "../components/common/Layout";
import Button from "../components/common/Button";
import OTPVerification from "../components/auth/OTPVerification";
import { useApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { SignInData, OTPVerificationData } from "../types";

const SignIn: React.FC = () => {
  const { authAPI } = useApi();
  const [step, setStep] = useState<"signin" | "otp">("signin");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    try {
      await authAPI.signIn(data);
      setUserEmail(data.email);
      setStep("otp");
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (data: OTPVerificationData) => {
    try {
      const response = await authAPI.verifySignInOTP(data);

      if (response?.token && response?.user) {
        login(response.token, response.user);
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid response from server. Please try again.");
      }
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
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <span className="text-lg font-bold text-white">HD</span>
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-600">
            Please login to continue to your account.
          </p>
        </div>

        {/* Form Content */}
        {step === "signin" ? (
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                placeholder="jonas_kahnwald@gmail.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" loading={loading} disabled={loading}>
              Sign in
            </Button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </div>
          </form>
        ) : (
          <OTPVerification
            email={userEmail}
            onSubmit={handleOTPVerification}
            onResendOTP={handleResendOTP}
            type="signin"
          />
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Need an account? </span>
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create one
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;