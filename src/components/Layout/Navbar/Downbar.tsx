
"use client";

import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Downbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navLinks = [
    { name: "ALL ACCOUNTS AT A GLANCE", href: "/accounts" },
    { name: "FOR YOU", href: "/for-you" },
    { name: "FOR YOUR BUSINESS", href: "/business" },
    { name: "ABOUT US", href: "/about" },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <nav className="relative z-50 w-full bg-white shadow-sm">

      <div className="flex min-h-[68px] w-full items-center">

        {/* Logo Section */}
        <div className="flex min-w-fit items-center pl-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={'/images/OikkoBank Fintech Logo.png'}
              alt="Oikko Bank"
              width={184}
              height={184} />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 items-center justify-end gap-5 px-5 md:px-8 lg:px-10">

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-[13px] font-medium text-[#1762AE] transition-colors duration-200 hover:text-[#003566]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="flex shrink-0 items-center justify-center text-white transition  px-4 py-2 rounded-md bg-[#003566] "
          >
            {searchOpen ? (
              <X size={23} strokeWidth={2.5} />
            ) : (
              <Search size={23} strokeWidth={2.8} />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute left-0 top-full w-full border-t border-gray-100 bg-white px-5 py-5 shadow-lg md:px-10">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-4xl items-center gap-3 rounded-md border border-gray-200 bg-[#F8FAFC] px-4 py-3 focus-within:border-[#1762AE]"
          >
            <Search size={21} className="shrink-0 text-[#1762AE]" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search accounts, services, information..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              autoFocus
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="shrink-0 text-[#1762AE] transition hover:text-[#003566]"
            >
              <ArrowRight size={22} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Downbar;
