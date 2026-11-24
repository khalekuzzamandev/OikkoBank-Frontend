"use client";

import { useState } from "react";
import { authClient, useSession } from "@/components/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  return (
    parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
  ).toUpperCase();
};

const Profile = () => {
  const { data: session, isPending } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = session?.user;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div
        aria-busy="true"
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#003566] p-3"
      >
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/20" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-white/20" />
          <div className="h-2.5 w-32 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#003566] p-3 shadow-sm">
      {/* Avatar */}
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt={user.name || "User avatar"}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/20"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white ring-2 ring-white/20"
        >
          {getInitials(user.name, user.email)}
        </div>
      )}

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-5 text-white">
          {user.name || "User"}
        </p>
        <p className="truncate text-xs leading-4 text-blue-100/70">
          {user.email}
        </p>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Logout"
        title="Logout"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-100/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <LogOut size={17} />
        )}
      </button>
    </div>
  );
};

export default Profile;