"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";

const User = () => {
  const user = useAppSelector(selectUser);

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
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#003566]">
          {user.name}
        </p>
        <p className="truncate text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default User;