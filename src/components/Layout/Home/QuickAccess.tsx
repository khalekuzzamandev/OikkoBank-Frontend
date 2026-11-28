
import React from "react";
import Link from "next/link";
import {
  UserRoundPlus,
  WalletCards,
  MapPinned,
  Store,
  FilePenLine,
  Percent,
  Globe,
  PiggyBank,
  Headset,
  CircleUser,
} from "lucide-react";

const services = [
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
    subtitle: "investors relationship",
    href: "/investors",
    icon: PiggyBank,
  },
];

const QuickAccess = () => {
  return (
    <section className="w-full bg-white py-5 sm:py-7">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 border-x border-[#1762AE]/25 md:grid-cols-4">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Link
                href={service.href}
                key={service.title + service.subtitle}
                className={`
                  group flex min-h-[100px] flex-col items-center justify-center
                  gap-1 px-2 py-4 text-center
                  transition-all duration-300 hover:bg-[#F3F8FD]
                  md:min-h-[100px] md:py-4
                  ${index % 2 === 0 ? "border-r border-[#1762AE]/25" : ""}
                  ${index < 6 ? "border-b border-[#1762AE]/25" : ""}
                  md:border-r
                  ${index % 4 === 3 ? "md:border-r-0" : ""}
                  ${index < 4 ? "md:border-b border-[#1762AE]/25" : ""}
                  ${index >= 4 ? "md:border-b-0" : ""}
                `}
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
