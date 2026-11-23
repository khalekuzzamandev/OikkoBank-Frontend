
import React from "react";
import { Clock3, ShieldCheck } from "lucide-react";

const Page = () => {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#003566] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-lg shadow-blue-900/5">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
          <Clock3 size={32} className="text-orange-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#003b68]">
          Your Account Is Under Review
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your account registration has been submitted successfully.
          Our team is currently reviewing your information.
          Please wait for approval.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600">
          <ShieldCheck size={16} />
          Verification Pending
        </div>
      </div>
    </main>
  );
};

export default Page;
