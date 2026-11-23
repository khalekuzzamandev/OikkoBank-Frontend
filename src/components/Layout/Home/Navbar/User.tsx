
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, LogOut } from "lucide-react";
import { selectUser, clearUser } from "@/Redux/features/UserSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";

const User = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace("/login");
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-md bg-[#003566] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1762AE]"
      >
        <UserRound size={18} />
        Sign in
      </Link>
    );
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003566] text-sm font-semibold text-white"
      >
        {initials || <UserRound size={18} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#003566]">
          {user.name}
        </p>
        <p className="truncate text-xs text-gray-500">
          {user.email}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex shrink-0 items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <LogOut size={17} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default User;
