
"use client";

import Link from "next/link";
import {
  CircleUser,
  Globe,
  Headset,
  LayoutDashboard,
  MapPinned,
  Percent,
  PiggyBank,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";
import { authClient } from "@/components/lib/auth-client";
import { getDashboardHref } from "@/components/lib/dashboard-route";

const publicServices = [
  {
    title: "Find",
    subtitle: "a Location",
    href: "/location",
    icon: MapPinned,
  },
  {
    title: "Contact Us",
    subtitle: "Contact page",
    href: "/contact",
    icon: CircleUser,
  },
  {
    title: "Help Center",
    subtitle: "Need Help?",
    href: "/help-center",
    icon: Headset,
  },
  {
    title: "View",
    subtitle: "Rates",
    href: "/rates",
    icon: Percent,
  },
  {
    title: "Oikko Career",
    subtitle: "Career Page",
    href: "/career",
    icon: Globe,
  },
  {
    title: "Investors",
    subtitle: "Investor relations",
    href: "/investors",
    icon: PiggyBank,
  },
];

const loggedOutActions = [
  {
    title: "Apply For Open Account",
    subtitle: "Right Now",
    href: "/register",
    icon: UserRoundPlus,
  },
  {
    title: "Oikko",
    subtitle: "Login/Sign-up",
    href: "/login",
    icon: WalletCards,
  },
];

const QuickAccess = () => {
  const { data: session, isPending } = authClient.useSession();

  const isActiveUser = session?.user?.status === "active";

  const accountAction = isActiveUser
    ? [
      {
        title: "Dashboard",
        subtitle: "Go to your account",
        href: getDashboardHref(session.user.role),
        icon: LayoutDashboard,
      },
    ]
    : loggedOutActions;

  const services = isPending
    ? publicServices
    : [...accountAction, ...publicServices];

  return (
    <section
      className="w-full bg-white py-5 sm:py-7"
      aria-label="Quick access"
      aria-busy={isPending}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 border-l border-t border-[#1762AE]/25 md:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                href={service.href}
                key={`${service.title}-${service.subtitle}`}
                className="group flex min-h-[100px] flex-col items-center justify-center gap-1 border-b border-r border-[#1762AE]/25 px-2 py-4 text-center transition-all duration-300 hover:bg-[#F3F8FD] md:py-4"
              >
                <Icon
                  size={23}
                  strokeWidth={1.5}
                  className="mb-0.5 text-[#1762AE] transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-[#003566]"
                />

                <span className="text-[13px] font-medium leading-[17px] text-[#00509D] transition-colors group-hover:text-[#003566] sm:text-sm">
                  {service.title}
                </span>

                <span className="text-[13px] font-medium leading-[17px] text-[#00509D] transition-colors group-hover:text-[#003566] sm:text-sm">
                  {service.subtitle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
