'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const result = await signup(formData.email, formData.password, formData.name);
      if (result.success) {
        const message = 'User signed up successfully.';
        setSuccessMessage(message);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('truefeed_signup_success', message);
        }
        router.push('/dashboard');
      } else {
        setApiError(result.error || 'Signup failed');
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
    setSuccessMessage('');
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join TrueFeed and start building a verified social hub."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        )}

        <Input
          label="Your name"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="w-full">
          Get Started
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
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-[#6f6258] hover:text-[#5f554d]">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
