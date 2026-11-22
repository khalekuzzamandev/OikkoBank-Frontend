
import { Search } from "lucide-react";
import Link from "next/link";
const Downbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="flex min-h-[68px] w-full items-center">

        {/* Logo Section */}
        <div className="flex h-[68px] w-[43%] items-center bg-[#E9EAF0] px-6 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 3L29 3L37 17H23L15 3Z" fill="#E63946" />
              <path d="M3 17L10 5L17 17L10 29L3 17Z" fill="#2463A6" />
              <path d="M10 29L17 17H33L26 29H10Z" fill="#159957" />
              <path d="M17 17L23 17L30 29H17L10 17H17Z" fill="#F4A62A" />
            </svg>

            <span className="text-[23px] font-semibold tracking-tight text-[#252525]">
              Prime Bank
            </span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 items-center justify-end gap-5 px-6 lg:gap-8 lg:px-10">

          <div className="hidden items-center gap-7 md:flex">
            <a href="#" className="whitespace-nowrap text-[13px] font-medium text-[#1762AE] hover:text-[#003566]">
              ALL ACCOUNTS AT A GLANCE
            </a>

            <a href="#" className="whitespace-nowrap text-[13px] font-medium text-[#1762AE] hover:text-[#003566]">
              FOR YOU
            </a>

            <a href="#" className="whitespace-nowrap text-[13px] font-medium text-[#1762AE] hover:text-[#003566]">
              FOR YOUR BUSINESS
            </a>

            <a href="#" className="whitespace-nowrap text-[13px] font-medium text-[#1762AE] hover:text-[#003566]">
              ABOUT US
            </a>
          </div>

          {/* Search */}
          <button
            aria-label="Search"
            className="text-[#1762AE] transition hover:text-[#003566]"
          >
            <Search size={23} strokeWidth={2.8} />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Downbar;