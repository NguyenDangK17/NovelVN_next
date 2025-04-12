"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import axios from "axios";
import { FormInput } from "@/components/FormInput";
import { validateSignupForm } from "@/utils/validation";
import { API_ENDPOINTS } from "@/config/api";
import { ASSETS } from "@/config/constants";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange =
    (field: keyof SignupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const { isValid, newErrors } = validateSignupForm(formData);

      if (!isValid) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 201) {
          window.location.replace("/login");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("Email")) {
            setErrors((prev) => ({ ...prev, email: errorMessage }));
          } else if (errorMessage.includes("Username")) {
            setErrors((prev) => ({ ...prev, username: errorMessage }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Signup failed. Please try again.",
          }));
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
        <Image
          width={48}
          height={48}
          className="mr-2"
          src={ASSETS.LOGO}
          alt="logo"
        />
        <span
          className="text-3xl font-bold text-white hover:cursor-pointer"
          onClick={() => window.location.replace("/")}
        >
          MangaVN
        </span>
      </div>

      <div className="w-full bg-[#212328] max-w-lg shadow border-t-4 border-primary-500">
        <div className="space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl text-center">
            Create your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange("username")}
              error={errors.username}
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={errors.confirmPassword}
            />

            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              className="w-full text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
            <p className="text-sm font-light text-gray-500 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary-600 hover:underline"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
