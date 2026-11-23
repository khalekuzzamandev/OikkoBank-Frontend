"use client";

import { selectUser } from '@/Redux/features/UserSlice';
import { useAppSelector } from '@/Redux/hooks';

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
} from "lucide-react";


const DashboradSidebar = () => {
  const user = useAppSelector(selectUser);

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

  return (
    <div>
      hii
    </div>
  );
};

export default DashboradSidebar;