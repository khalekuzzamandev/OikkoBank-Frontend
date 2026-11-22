"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const REQUIRED_MSG = "This field is required";

const baseInput =
  "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2";
const normalInput = "border-gray-300 focus:border-[#1762AE] focus:ring-[#1762AE]/20";
const errorInput = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

const labelClass = "mb-1 block text-xs font-medium text-gray-700";

const LoginPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.name && errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[target.name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const result: Record<string, string> = {};

    const email = (data.email || "").trim();
    const password = data.password || "";

    if (!email) result.email = REQUIRED_MSG;
    else if (!/^\S+@\S+\.\S+$/.test(email)) result.email = "Enter a valid email address";

    if (!password) result.password = REQUIRED_MSG;

    setErrors(result);

    if (Object.keys(result).length > 0) {
      document.getElementById(Object.keys(result)[0])?.focus();
      return;
    }

    console.log(data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#003566] px-4 py-8">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/images/oikko bank logo.PNG"
              alt="Oikko Bank"
              width={140}
              height={50}
              priority
              className="h-auto w-36 object-contain"
            />
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-[#003566]">Log In</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} onChange={handleChange} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`${baseInput} ${errors.email ? errorInput : normalInput}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                autoComplete="current-password"
                className={`${baseInput} pr-10 ${errors.password ? errorInput : normalInput}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1762AE]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-gray-300 accent-[#003566]"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-medium text-[#1762AE] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#003566] py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1762AE]"
          >
            Log In
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          New customer?{" "}
          <Link href="/register" className="font-semibold text-[#1762AE] hover:underline">
            Apply for an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;