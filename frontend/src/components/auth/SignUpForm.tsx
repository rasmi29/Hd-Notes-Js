import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import type { SignUpData } from '../../types';

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpData>();

  const onFormSubmit = async (data: SignUpData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
        <input
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
            pattern: { value: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' }
          })}
          type="text"
          placeholder="Jonas Khanwald"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
        <div className="relative">
          <input
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: (value) => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 13) return 'You must be at least 13 years old';
                if (age > 120) return 'Please enter a valid date of birth';
                return true;
              }
            })}
            type="date"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        {errors.dateOfBirth && (
          <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>

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

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
      >
        Get OTP
      </Button>
    </form>
  );
};

export default SignUpForm;