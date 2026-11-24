
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { setUser } from "@/Redux/features/UserSlice";
import { useAppDispatch } from "@/Redux/hooks";
import { authClient } from "@/components/lib/auth-client";

const REQUIRED_MSG = "This field is required";

const INPUT_CLASS =
  "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2";
const NORMAL_INPUT =
  "border-gray-300 focus:border-[#1762AE] focus:ring-[#1762AE]/20";
const ERROR_INPUT =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const LABEL_CLASS = "mb-1 block text-xs font-medium text-gray-700";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;

    if (target.name && errors[target.name]) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[target.name];
        return updatedErrors;
      });
    }

    if (error) setError("");
  };

  const validateForm = (data: Record<string, string>) => {
    const newErrors: Record<string, string> = {};

    const email = data.email?.trim() || "";
    const password = data.password || "";

    if (!email) {
      newErrors.email = REQUIRED_MSG;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = REQUIRED_MSG;
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const newErrors = validateForm(data);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      document.getElementById(Object.keys(newErrors)[0])?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: session, error: signInError } = await authClient.signIn.email({
        email: data.email.trim(),
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
      } else if (session?.user) {
        dispatch(setUser(session.user));

        const status = session.user.status?.toLowerCase();
        if (status === "pending") {
          router.replace("/underReview");
        } else if (status === "active") {
          const role = session.user.role?.toLowerCase();
          if (role && ["admin", "staff", "customer"].includes(role)) {
            router.replace(`/dashboard/${role}`);
          } else {
            setError("Your account role could not be determined. Please contact support.");
          }
        } else {
          setError("Your account status could not be determined. Please contact support.");
        }
      } else {
        setError("Unable to retrieve your account details. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

          <h1 className="mt-4 text-xl font-semibold text-[#003566]">
            Log In
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          onChange={handleChange}
          noValidate
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className={LABEL_CLASS}>
              Email <span className="text-red-500">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`${INPUT_CLASS} ${errors.email ? ERROR_INPUT : NORMAL_INPUT}`}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={LABEL_CLASS}>
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                autoComplete="current-password"
                className={`${INPUT_CLASS} pr-10 ${errors.password ? ERROR_INPUT : NORMAL_INPUT}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1762AE]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
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

            <Link
              href="/forgot-password"
              className="font-medium text-[#1762AE] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#003566] py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          New customer?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#1762AE] hover:underline"
          >
            Apply for an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
