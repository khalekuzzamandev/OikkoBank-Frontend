
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";

import {
  LayoutDashboard,
  Wallet,
  ChartBar,
  Users,
  Banknote,
  HandCoins,
  Settings,
  UserCog,
  ShieldAlert,
  ArrowLeftRight,
  ArrowUpFromLine,
  Bell,
  UserRound,
  FileText,
  ArrowRightLeft,
  Menu,
  X,
  ChevronRight,
  Landmark,
} from "lucide-react";
import Profile from "./Profile";

const DashboardItem = {
  admin: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: Wallet, label: "Accounts", href: "/dashboard/admin/accounts" },
    { icon: ChartBar, label: "Analytics", href: "/dashboard/admin/analytics" },
    { icon: Users, label: "Customers", href: "/dashboard/admin/customers" },
    { icon: Banknote, label: "Deposits", href: "/dashboard/admin/deposits" },
    { icon: HandCoins, label: "Loans", href: "/dashboard/admin/loans" },
    { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
    { icon: UserCog, label: "Staff", href: "/dashboard/admin/staff" },
    { icon: ShieldAlert, label: "Suspicious Activities", href: "/dashboard/admin/suspicious-activities" },
    { icon: ArrowLeftRight, label: "Transactions", href: "/dashboard/admin/transactions" },
    { icon: ArrowUpFromLine, label: "Withdrawals", href: "/dashboard/admin/withdrawals" },
  ],

  staff: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/staff" },
    { icon: Wallet, label: "Accounts", href: "/dashboard/staff/accounts" },
    { icon: Users, label: "Customers", href: "/dashboard/staff/customers" },
    { icon: Banknote, label: "Deposit Requests", href: "/dashboard/staff/deposit-requests" },
    { icon: HandCoins, label: "Loan Applications", href: "/dashboard/staff/loan-applications" },
    { icon: ArrowLeftRight, label: "Transactions", href: "/dashboard/staff/transactions" },
    { icon: ArrowUpFromLine, label: "Withdrawal Requests", href: "/dashboard/staff/withdrawal-requests" },
  ],

  customer: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/customer" },
    { icon: Wallet, label: "My Accounts", href: "/dashboard/customer/accounts" },
    { icon: Banknote, label: "Deposits", href: "/dashboard/customer/deposits" },
    { icon: HandCoins, label: "Loans", href: "/dashboard/customer/loans" },
    { icon: Bell, label: "Notifications", href: "/dashboard/customer/notifications" },
    { icon: UserRound, label: "My Profile", href: "/dashboard/customer/profile" },
    { icon: FileText, label: "Statements", href: "/dashboard/customer/statements" },
    { icon: ArrowLeftRight, label: "Transactions", href: "/dashboard/customer/transactions" },
    { icon: ArrowRightLeft, label: "Transfer Money", href: "/dashboard/customer/transfer" },
    { icon: ArrowUpFromLine, label: "Withdrawals", href: "/dashboard/customer/withdrawals" },
  ],
};

const DashboardSidebar = () => {
  const user = useAppSelector(selectUser);
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role?.toLowerCase() as
    | keyof typeof DashboardItem
    | undefined;

  const menuItems = role ? DashboardItem[role] : undefined;

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!user || !menuItems) return null;

  const initials = (user.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = (href: string) => {
    if (
      href === "/dashboard/admin" ||
      href === "/dashboard/staff" ||
      href === "/dashboard/customer"
    ) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };
  
  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur-xl lg:hidden">

        <Link href={`/dashboard/${role}`} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003566]">
            <Landmark size={21} className="text-white" />
          </div>

          <div>
            <h2 className="text-base font-extrabold leading-tight text-[#003566]">
              Oikko Bank
            </h2>
            <p className="text-[10px] font-medium capitalize text-gray-400">
              {role} Dashboard
            </p>
          </div>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-[#003566] transition hover:bg-[#F0F5FA]"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        className={`
          fixed left-0 top-0 z-50
          flex h-dvh w-[280px] max-w-[85vw]
          flex-col
          border-r border-white/10
          bg-[#003566] px-4 py-5 text-white
          shadow-xl
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen
          lg:w-[280px] lg:max-w-none
          lg:shrink-0 lg:translate-x-0 lg:shadow-none
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 py-4">
          <Link
            href={`/dashboard/${role}`}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
              <span className="text-2xl font-extrabold text-[#003566]">
                O
              </span>
              <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[#F26B21]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold leading-tight">
                Oikko Bank
              </h2>
              <p className="mt-1 truncate text-xs capitalize text-white/60">
                {role} Dashboard
              </p>
            </div>
          </Link>

          {/* Mobile Close */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`
                  group relative flex items-center gap-3
                  rounded-lg px-3 py-3
                  text-sm font-medium
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#F26B21]
                  ${active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#F26B21]" />
                )}

                <Icon
                  size={19}
                  strokeWidth={2}
                  className={
                    active
                      ? "text-[#F26B21]"
                      : "text-white/50 transition group-hover:text-[#F26B21]"
                  }
                />

                <span className="min-w-0 flex-1">
                  {item.label}
                </span>

                {active && (
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-[#F26B21]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="shrink-0 border-t border-white/10 pt-4">
         <Profile/>
        </div>
      </aside>

      {/* Mobile Header Spacing */}
      <div className="h-16 shrink-0 lg:hidden" />
    </>
  );
};

export default DashboardSidebar;
