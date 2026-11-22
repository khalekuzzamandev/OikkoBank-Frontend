
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
    <nav className="relative z-50 w-full shadow-sm bg-[#003566] py-4">
      <div className="mx-auto flex px-4 py-3 w-full max-w-7xl items-center justify-between gap-5  bg-white rounded-md">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/oikko bank logo.PNG"
            alt="Oikko Bank"
            width={200}
            height={200}
            priority
            className="h-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4 lg:gap-7">
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-[12px] font-semibold text-[#1762AE] transition-colors duration-200 hover:text-[#003566] xl:text-[13px]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="flex h-10 w-11 shrink-0 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#1762AE]"
          >
            {searchOpen ? (
              <X size={22} />
            ) : (
              <Search size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute left-0 top-full w-full px-5 py-5">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 rounded-md border border-white px-4 py-3"
          >
            <Search size={21} className="shrink-0 text-white" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search accounts, services, information..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/70"
              autoFocus
            />

            <button type="submit" aria-label="Submit search">
              <ArrowRight size={22} className="text-white" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Downbar;
