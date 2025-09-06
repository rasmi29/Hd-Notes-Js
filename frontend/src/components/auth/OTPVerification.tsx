import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import type { OTPVerificationData } from '../../types';

interface OTPVerificationProps {
  userId?: string; 
  email: string;
  onSubmit: (data: OTPVerificationData) => Promise<void>;
  onResendOTP: () => Promise<void>;
  type: "signup" | "signin";
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onSubmit,
  onResendOTP,
  type
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onSubmit({ email, otp });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await onResendOTP();
      setResendTimer(60); // 60 second cooldown
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    // Only allow numeric input and max 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
    if (error) setError('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter OTP sent to {email}
          </label>
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => handleOTPChange(e.target.value)}
              placeholder="000000"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg tracking-widest ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={6}
            />
            <div className="absolute inset-y-0 flex items-center right-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading || otp.length !== 6}
        >
          {type === 'signup' ? 'Sign up' : 'Sign in'}
        </Button>
      </form>

      {/* Resend OTP */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-600">
            Resend OTP in {resendTimer} seconds
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;