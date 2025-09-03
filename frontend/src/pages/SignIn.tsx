import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import OTPVerification from '../components/auth/OTPVerification';
import { useApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { SignInData, OTPVerificationData } from '../types';

const SignIn: React.FC = () => {
  const { authAPI } = useApi();
  const [step, setStep] = useState<'signin' | 'otp'>('signin');
  const [userId, setUserId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInData>();

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    try {

      const response = await authAPI.signIn(data);
      console.log("SignIn response:", response);
      setUserEmail(data.email);
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (data: OTPVerificationData) => {
    try {
      const response = await authAPI.verifySignInOTP(data);
      login(response.token!, response.user!);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.resendOTP(userEmail);
      toast.success('New OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600">Please login to continue to your account.</p>
        </div>

        {/* Form Content */}
        {step === 'signin' ? (
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                placeholder="jonas_kahnwald@gmail.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Keep me logged in
            <div className="flex items-center">
              <input
                id="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-900">
                Keep me logged in
              </label>
            </div> */}

            {/* Submit Button */}
            <Button type="submit" loading={loading} disabled={loading}>
              Sign in
            </Button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {/* Handle resend OTP for signin */}}
              >
                Resend OTP
              </button>
            </div>
          </form>
        ) : (
          <OTPVerification
            userId={userId}
            email={userEmail}
            onSubmit={handleOTPVerification}
            onResendOTP={handleResendOTP}
            type="signin"
          />
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Need an account? </span>
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Create one
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;