
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

const Topbar = () => {
  return (
    <div className="w-full border-b border-[#ff7900]/30 bg-[#003566] text-white shadow-sm">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between px-6">

        {/* Left Side */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 text-[17px]">
            <Link href="#" aria-label="Facebook" className="transition hover:text-blue-400">
              <FaFacebookF />
            </Link>

            <Link href="#" aria-label="Instagram" className="transition hover:text-pink-400">
              <FaInstagram />
            </Link>

            <Link href="#" aria-label="LinkedIn" className="transition hover:text-blue-400">
              <FaLinkedinIn />
            </Link>

            <Link href="#" aria-label="YouTube" className="transition hover:text-red-400">
              <FaYoutube />
            </Link>
          </div>

          <div className="h-5 w-px bg-white/40" />

          <p className="hidden text-[13px] font-medium tracking-wide sm:block">
            Secure • Smart • Together
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 text-[12px] font-medium sm:gap-4 sm:text-[13px]">
          <Link href="/help-center" className="transition hover:text-blue-300">
            Help Center
          </Link>

          <span className="h-4 w-px bg-white/40" />

          <Link href="/contact" className="transition hover:text-blue-300">
            Contact
          </Link>

          <span className="h-4 w-px bg-white/40" />

          <Link href="#" className="transition hover:text-blue-300">
            Careers
          </Link>

          <span className="h-4 w-px bg-white/40" />

          <Link href="#" className="hidden transition hover:text-blue-300 sm:block">
            Investors Relation
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Topbar;
