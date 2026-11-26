"use client";

import { useState } from "react";
import {
  HandCoins,
  Wallet,
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";

const CustomerLoanPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    user,
    primaryAccount,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountLoading) {
      alert("Please wait. Your bank account is loading.");
      return;
    }

    if (accountError) {
      alert("Unable to load your bank account. Please try again.");
      return;
    }

    if (!user?.id) {
      alert("User information not found. Please login again.");
      return;
    }

    if (!primaryAccount) {
      alert("No bank account found. Please create a bank account first.");
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      alert("Your bank account is not active. You cannot apply for a loan.");
      return;
    }

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const loanData = {
      // Loan Information
      loanType: formData.get("loanType"),
      loanAmount: Number(formData.get("loanAmount")),
      loanDuration: formData.get("loanDuration"),
      repaymentMethod: formData.get("repaymentMethod"),
   

      // Employment Information
      occupation: formData.get("occupation"),
      organization: formData.get("organization"),
      monthlyIncome: Number(formData.get("monthlyIncome")),
      monthlyExpenses: Number(formData.get("monthlyExpenses")),
      employmentDuration: formData.get("employmentDuration"),
      officePhone: formData.get("officePhone"),

      // Additional Information
      additionalNotes: formData.get("additionalNotes"),
      termsAccepted: formData.get("termsAccepted") === "true",

      // Logged-in User Information
      userId: user.id,
      userEmail: user.email || primaryAccount.userEmail || "",

      // Bank Account Information
      accountId: primaryAccount._id || "",
      accountNumber: primaryAccount.accountNumber,
      accountName: primaryAccount.accountName,
      accountType: primaryAccount.accountType,
      accountEmail: primaryAccount.userEmail,
      accountStatus: primaryAccount.status,

      // Application Information
      loanStatus: "Pending",
      applicationDate: new Date().toISOString(),
    };

    console.log("Loan Application Data:", loanData);

    setLoading(false);
    form.reset();

    
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#003566] p-3 text-white">
            <HandCoins size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#003566]">
              Apply for a Loan
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Complete the application form to request a bank loan.
            </p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <CheckCircle2 className="shrink-0 text-blue-600" size={21} />

        <p className="text-sm leading-6 text-blue-800">
          Please provide accurate personal, employment and financial
          information. Your application will be reviewed by a bank
          representative before approval.
        </p>
      </div>

      {/* Loan Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        {/* Loan Information */}
        <div className="border-b border-gray-100 p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <Wallet className="text-[#1762AE]" size={22} />

            <div>
              <h2 className="font-bold text-[#003566]">
                Loan Information
              </h2>

              <p className="text-xs text-gray-500">
                Select your preferred loan and amount.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Loan Type *
              </label>

              <select
                name="loanType"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              >
                <option value="" disabled>
                  Select loan type
                </option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Car Loan">Car Loan</option>
                <option value="Agriculture Loan">Agriculture Loan</option>
                <option value="Salary Loan">Salary Loan</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Requested Loan Amount (৳) *
              </label>

              <input
                name="loanAmount"
                type="number"
                min="1000"
                placeholder="e.g. 500000"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Loan Duration *
              </label>

              <select
                name="loanDuration"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              >
                <option value="" disabled>
                  Select duration
                </option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
                <option value="24 Months">24 Months</option>
                <option value="36 Months">36 Months</option>
                <option value="48 Months">48 Months</option>
                <option value="60 Months">60 Months</option>
                <option value="120 Months">120 Months</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Preferred Repayment Method *
              </label>

              <select
                name="repaymentMethod"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              >
                <option value="" disabled>
                  Select repayment method
                </option>
                <option value="Monthly Installment">
                  Monthly Installment
                </option>
                <option value="Quarterly">Quarterly</option>
                <option value="Salary Deduction">Salary Deduction</option>
              </select>
            </div>

    
          </div>
        </div>

        {/* Employment Information */}
        <div className="border-b border-gray-100 p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <BriefcaseBusiness className="text-[#1762AE]" size={22} />

            <div>
              <h2 className="font-bold text-[#003566]">
                Employment Information
              </h2>

              <p className="text-xs text-gray-500">
                Provide your current employment and income details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Occupation *
              </label>

              <select
                name="occupation"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              >
                <option value="" disabled>
                  Select occupation
                </option>
                <option value="Government Employee">
                  Government Employee
                </option>
                <option value="Private Employee">Private Employee</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Teacher">Teacher</option>
                <option value="Farmer">Farmer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Company / Organization
              </label>

              <input
                name="organization"
                type="text"
                placeholder="Enter organization name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Monthly Income (৳) *
              </label>

              <input
                name="monthlyIncome"
                type="number"
                min="0"
                placeholder="Enter monthly income"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Monthly Expenses (৳) *
              </label>

              <input
                name="monthlyExpenses"
                type="number"
                min="0"
                placeholder="Enter monthly expenses"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Employment Duration
              </label>

              <input
                name="employmentDuration"
                type="text"
                placeholder="e.g. 3 years"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Office Contact Number
              </label>

              <input
                name="officePhone"
                type="tel"
                placeholder="Enter office phone number"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="text-[#1762AE]" size={22} />

            <div>
              <h2 className="font-bold text-[#003566]">
                Additional Information
              </h2>

              <p className="text-xs text-gray-500">
                Add any additional details for your application.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Additional Notes
            </label>

            <textarea
              name="additionalNotes"
              rows={3}
              placeholder="Write additional information (optional)..."
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1762AE]"
            />
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="termsAccepted"
              value="true"
              required
              className="mt-1 h-4 w-4 accent-[#1762AE]"
            />

            <span className="text-xs leading-5 text-gray-600">
              I confirm that all the information provided is accurate
              and complete. I agree to the bank&apos;s loan application
              terms and conditions.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:px-7">
          <p className="text-xs text-gray-500">* Required fields</p>

          <button
            type="submit"
            disabled={loading || accountLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading || accountLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <HandCoins size={18} />
            )}

            {accountLoading
              ? "Loading Account..."
              : loading
                ? "Submitting..."
                : "Submit Loan Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerLoanPage;