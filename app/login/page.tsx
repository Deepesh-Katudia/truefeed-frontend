'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setApiError(result.error || 'Invalid credentials');
      }
    } catch {
      setApiError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue where your feed left off."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <Input
          label="Your email"
          type="email"
          name="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="group flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-[#302c28]/20 bg-[#fffaf4] text-[#6f6258] focus:ring-[#d6ccc2]"
            />
            <span className="ml-2 text-[#756b62] transition-colors group-hover:text-[#4d453e]">Remember me</span>
          </label>
          <a href="#" className="font-semibold text-[#6f6258] hover:text-[#5f554d]">
            Forgot password?
          </a>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#302c28]/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#fffaf4] px-4 text-[#756b62]">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 transition-colors hover:bg-[#d6ccc2]/70"
          >
            <span className="text-sm font-bold text-[#4d453e]">Be</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 transition-colors hover:bg-[#d6ccc2]/70"
            aria-label="Continue with Google"
          >
            <span className="text-sm font-bold text-[#4d453e]">G</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 transition-colors hover:bg-[#d6ccc2]/70"
            aria-label="Continue with Facebook"
          >
            <span className="text-sm font-bold text-[#4d453e]">f</span>
          </button>
        </div>

        <p className="pt-2 text-center text-sm text-[#756b62]">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-[#6f6258] hover:text-[#5f554d]">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
