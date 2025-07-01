'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import FormInput from '@/components/FormInput';
import { ASSETS } from '@/config/constants';
import Link from 'next/link';
import { login } from '@/utils/auth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Define a type for the error with a response property
interface ErrorWithResponse {
  response: {
    status: number;
    data: { message: string };
  };
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange =
    (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    };

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});

      try {
        await login(formData.email, formData.password);
        window.location.replace('/');
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as ErrorWithResponse).response === 'object' &&
          (error as ErrorWithResponse).response !== null
        ) {
          const response = (error as ErrorWithResponse).response;
          if (response.status === 401) {
            setErrors({
              general: 'Invalid email or password',
            });
          } else if (response.status === 400) {
            const errorMessage = response.data.message;
            if (typeof errorMessage === 'string' && errorMessage.includes('Email')) {
              setErrors(prev => ({ ...prev, email: errorMessage }));
            } else if (typeof errorMessage === 'string' && errorMessage.includes('Password')) {
              setErrors(prev => ({ ...prev, password: errorMessage }));
            }
          }
        } else {
          setErrors({
            general: 'An error occurred. Please try again later.',
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${ASSETS.BACKGROUND_IMAGE})` }}
    >
      <div className="flex items-center justify-center mb-6">
        <Image width={48} height={48} className="mr-2" src={ASSETS.LOGO} alt="logo" />
        <span
          className="text-3xl font-bold text-white hover:cursor-pointer"
          onClick={() => window.location.replace('/')}
        >
          MangaVN
        </span>
      </div>

      <div className="w-full bg-[#212328] max-w-lg shadow border-t-4 border-primary-500">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl text-center">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
            />

            {errors.general && (
              <p className="text-red-500 text-sm text-center" role="alert">
                {errors.general}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-500">
                    Remember me
                  </label>
                </div>
              </div>
              <a href="#" className="text-sm font-medium text-primary-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="text-sm text-gray-400 text-center">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary-500 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
