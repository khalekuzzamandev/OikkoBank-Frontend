
"use client";

import { useState } from "react";
import { Search, X, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUser } from "@/Redux/features/UserSlice";

const Downbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const user = useSelector(selectUser);

  const navLinks = [
    { name: "ALL ACCOUNTS AT A GLANCE", href: "/accounts" },
    { name: "FOR YOU", href: "/for-you" },
    { name: "FOR YOUR BUSINESS", href: "/business" },
    { name: "ABOUT US", href: "/about" },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  const homeHref = user?.role ? `/${user.role.toLowerCase()}` : "/";

  const dashboardHref = user?.role
    ? `/${user.role.toLowerCase()}`
    : "/";

  return (
    <nav className="relative z-50 w-full bg-[#003566] py-4 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 rounded-md bg-white px-4 py-3">
        <Link href={homeHref} className="flex shrink-0 items-center">
          <Image
            src="/images/oikko bank logo.PNG"
            alt="Oikko Bank"
            width={200}
            height={200}
            priority
            className="h-auto object-contain"
          />
        </Link>

        <div className="flex items-center justify-end gap-4 lg:gap-7">
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-semibold tracking-wide text-[#003566] transition hover:text-blue-500 xl:text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <Link
                href={dashboardHref}
                aria-label="Dashboard"
                title="Dashboard"
                className="flex h-10 w-11 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#00264a]"
              >
                <LayoutDashboard size={21} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              className="flex h-10 w-11 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#00264a]"
            >
              {searchOpen ? <X size={21} /> : <Search size={21} />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute left-0 top-full w-full bg-white p-4 shadow-lg">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-3xl items-center gap-3"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search anything..."
              className="h-12 flex-1 rounded-md border border-gray-300 px-4 text-sm text-gray-800 outline-none transition focus:border-[#003566]"
            />

            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-md bg-[#003566] px-5 text-sm font-semibold text-white transition hover:bg-[#00264a]"
            >
              Search
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Downbar;
