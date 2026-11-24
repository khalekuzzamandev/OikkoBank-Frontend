
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import Topbar from "./Topbar";
import Downbar from "./Downbar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { selectUser } from "@/Redux/features/UserSlice";
import { useSelector } from "react-redux";

const NavbarContent = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const user = useSelector(selectUser);

  // Dashboard pages hide Navbar
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

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
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      closeMenu();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Topbar />
        <Downbar />
      </div>

      {/* Mobile Navbar */}
      <div className="relative lg:hidden">
        <div className="flex h-[68px] items-center justify-between bg-white px-4 shadow-sm sm:px-5">
          <div className="flex min-w-0 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/OikkoBank Fintech Logo.png"
                alt="Oikko Bank"
                width={184}
                height={184}
                className="h-auto w-36 object-contain sm:w-40"
              />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {user?.status === "active" && (
              <Link
                href={`/dashboard/${user.role}`}
                aria-label="Dashboard"
                title="Dashboard"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#1762AE]"
              >
                <LayoutDashboard size={21} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#003566] text-white transition hover:bg-[#1762AE]"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-68px)] w-full overflow-y-auto bg-white shadow-xl">
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
                  <ChevronRight size={18} className="text-[#1762AE]" />
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-[#F3F6FA] px-6 py-5">
              <p className="text-center text-xs text-gray-500">
                © 2026 Oikko Bank. All Rights Reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Navbar = () => {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;
