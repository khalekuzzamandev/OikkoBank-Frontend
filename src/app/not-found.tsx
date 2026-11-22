import React from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#003566] px-4 py-10">
      <div className="w-full max-w-xl rounded-xl bg-white px-6 py-12 text-center shadow-2xl sm:px-10">
        <p className="text-7xl font-extrabold tracking-widest text-[#003566] sm:text-8xl">
          404
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#003566]/40" />
        <h1 className="mt-5 text-xl font-semibold text-[#003566] sm:text-2xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#003566] px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#003566]/85"
        >
          <FiHome size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;