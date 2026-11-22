
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import Topbar from "./Topbar";
import Downbar from "./Downbar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navLinks = [
    { name: "All Accounts at a Glance", href: "/accounts" },
    { name: "For You", href: "/for-you" },
    { name: "For Your Business", href: "/business" },
    { name: "About Us", href: "/about" },
    { name: "Help Center", href: "/help" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Investors Relation", href: "/investors" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <header className="w-full">

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Topbar />
        <Downbar />
      </div>

      {/* Mobile Navbar */}
      <div className="relative lg:hidden">

        {/* Mobile Header */}
        <div className="flex h-[68px] items-center justify-between bg-white px-5 shadow-sm">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 3L29 3L37 17H23L15 3Z" fill="#E63946" />
              <path d="M3 17L10 5L17 17L10 29L3 17Z" fill="#2463A6" />
              <path d="M10 29L17 17H33L26 29H10Z" fill="#159957" />
              <path d="M17 17L23 17L30 29H17L10 17H17Z" fill="#F4A62A" />
            </svg>

            <span className="text-[22px] font-semibold tracking-tight text-[#252525]">
              Prime Bank
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#1762AE]"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-68px)] w-full overflow-y-auto bg-white shadow-xl">

            {/* Social Section */}
            <div className="bg-[#003566] px-5 py-5 text-white">

              <p className="mb-4 text-sm font-medium tracking-wide">
                Secure • Smart • Together
              </p>

              <div className="flex items-center gap-5 text-xl">
                <Link href="#" aria-label="Facebook" className="text-[#1877F2]">
                  <FaFacebookF />
                </Link>

                <Link href="#" aria-label="Instagram" className="text-[#E4405F]">
                  <FaInstagram />
                </Link>

                <Link href="#" aria-label="LinkedIn" className="text-[#0A66C2]">
                  <FaLinkedinIn />
                </Link>

                <Link href="#" aria-label="YouTube" className="text-[#FF0000]">
                  <FaYoutube />
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 p-5">
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 rounded-md border border-gray-200 bg-[#F8FAFC] px-4 py-3 focus-within:border-[#1762AE]"
              >
                <Search size={20} className="text-[#1762AE]" />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none"
                />

                <button type="submit" aria-label="Search">
                  <ChevronRight size={21} className="text-[#1762AE]" />
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="px-5 py-3">

              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Main Navigation
              </p>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between border-b border-gray-100 px-2 py-4 text-[14px] font-medium text-[#003566] transition hover:bg-[#F3F7FC]"
                >
                  {link.name}

                  <ChevronRight
                    size={18}
                    className="text-[#1762AE]"
                  />
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-[#F3F6FA] px-6 py-5">
              <p className="text-center text-xs text-gray-500">
                © 2026 Prime Bank. All Rights Reserved.
              </p>
            </div>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
