
"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  X,
  UserRound,
  Settings,
  LogOut,
  HelpCircle,
  ShieldCheck,
  CalendarDays,
  Landmark,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from "lucide-react";

import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";
import { usePathname } from "next/navigation";
import Link from "next/link";

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const subscribeToDate = (onStoreChange: () => void) => {
  const interval = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(interval);
};

const getDateSnapshot = () => dateFormatter.format(new Date());
const getServerDateSnapshot = () => "";

const DashboardNavbar = () => {
  const user = useAppSelector(selectUser);
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  const initials = (user?.name || "User")
    .split(" ")
    .map((name: string) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pageName =
    pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
    "Dashboard";

  const notifications = [
    {
      icon: ArrowDownLeft,
      title: "Deposit received",
      description: "Your account has received a new deposit.",
      time: "Recently",
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
    },
    {
      icon: ArrowUpRight,
      title: "Transaction update",
      description: "Your recent transaction has been processed.",
      time: "Recently",
      color: "text-orange-300",
      bg: "bg-orange-400/10",
    },
    {
      icon: ShieldCheck,
      title: "Security update",
      description: "Your banking dashboard is secured.",
      time: "Recently",
      color: "text-blue-200",
      bg: "bg-blue-400/10",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#003566] text-white shadow-lg shadow-[#003566]/10 hidden xl:block">

      {/* Main Navbar */}
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="min-w-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-blue-100/70">
            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <span className="text-white/40">/</span>

            <span className="truncate capitalize text-white">
              {pageName}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="truncate text-lg font-bold capitalize text-white sm:text-xl">
              {pageName}
            </h1>

            <span className="hidden items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-200 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              System Online
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

          {/* Desktop Search */}
          <div className="relative hidden xl:block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-100/60"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="h-10 w-52 rounded-lg border border-white/15 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-blue-100/50 focus:border-white/40 focus:bg-white/15 2xl:w-64"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white xl:hidden"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>


          {/* Help */}
          <Link
            href="/dashboard"
            aria-label="Help center"
            title="Help & Support"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <HelpCircle size={20} />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#003566] bg-[#F26B21]" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-14 z-50 w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-xl border border-white/10 bg-[#003566] shadow-2xl shadow-black/30">

                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div>
                    <h3 className="font-bold text-white">
                      Notifications
                    </h3>
                    <p className="mt-1 text-xs text-blue-100/60">
                      Your latest account activities
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-blue-100">
                    Recent
                  </span>
                </div>

                <div className="divide-y divide-white/10">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon;

                    return (
                      <div
                        key={index}
                        className="flex gap-3 p-4 transition hover:bg-white/5"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.bg} ${notification.color}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-blue-100/60">
                            {notification.description}
                          </p>

                          <p className="mt-2 flex items-center gap-1 text-[10px] text-blue-100/40">
                            <Clock size={11} />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 p-3 text-center">
                  <span className="text-xs font-semibold text-blue-200">
                    Notification Center
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden h-9 w-px bg-white/15 sm:block" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-white/10 sm:gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-xs font-bold text-white ring-2 ring-white/10">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-28 truncate text-sm font-semibold text-white">
                  {user?.name || "User"}
                </p>

                <p className="text-[11px] capitalize text-blue-100/60">
                  {user?.role || "Account"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-blue-100/70 transition sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#003566] shadow-2xl shadow-black/30">

                {/* Profile Info */}
                <div className="border-b border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-blue-100/60">
                        {user?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                    <ShieldCheck size={14} />
                    Secure Account
                  </div>
                </div>

                {/* Menu */}
                <div className="p-2">
                  <Link
                    href={`/dashboard/${user?.role?.toLowerCase()}/profile`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-50 transition hover:bg-white/10"
                  >
                    <UserRound size={17} />
                    My Profile
                  </Link>

                  <Link
                    href={`/dashboard/${user?.role?.toLowerCase()}/settings`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-50 transition hover:bg-white/10"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

                  <div className="my-2 border-t border-white/10" />

                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                  >
                    <LogOut size={17} />
                    Close Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#003566] px-4 py-3 xl:hidden">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-100/60"
            />

            <input
              type="text"
              placeholder="Search anything..."
              autoFocus
              className="h-11 w-full rounded-lg border border-white/15 bg-white/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-white/40"
            />
          </div>
        </div>
      )}

      {/* Bank Information Strip */}
      <div className="hidden items-center justify-between border-t border-white/10 bg-[#002B54] px-4 py-2 text-[11px] sm:flex sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-blue-100/80">
          <Landmark size={14} />
          <span className="font-semibold tracking-wide">
            OIKKO BANK
          </span>
          <span className="text-white/30">|</span>
          <span>Digital Banking Portal</span>
        </div>

        <div className="flex items-center gap-4 text-blue-100/70">
          <span className="flex items-center gap-1.5">
            <Wallet size={13} />
            Banking Services
          </span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-300" />
            Secure Connection
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
