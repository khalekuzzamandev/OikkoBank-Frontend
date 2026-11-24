
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserRound,
  Wallet,
  CreditCard,
  Banknote,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { createCustomerBankAccount } from "@/components/lib/Apis/accounts/account";

const generateAccountNumber = () => {
  return String(
    Math.floor(100000000 + Math.random() * 900000000)
  );
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

const readOnlyClass =
  "w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

function ApprovedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = searchParams.get("customerId") || "";
  const customerEmail = searchParams.get("customerEmail") || "";
  const staffEmail = searchParams.get("staffEmail") || "";

  const [accountNumber, setAccountNumber] = useState(() =>
    generateAccountNumber()
  );
  const [loading, setLoading] = useState(false);

  const regenerateAccountNumber = () => {
    setAccountNumber(generateAccountNumber());
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!accountNumber) {
      alert("Account number is not generated!");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const accountData = {
      userId: String(formData.get("userId")),
      userEmail: String(formData.get("userEmail")),
      staffEmail: String(formData.get("staffEmail")),
      accountNumber: String(formData.get("accountNumber")),
      accountName: String(formData.get("accountName")),
      accountType: String(formData.get("accountType")),
      currency: String(formData.get("currency")),
      status: String(formData.get("status")),
      accountPurpose: String(formData.get("accountPurpose") || ""),

      balance: Number(formData.get("balance")),
      minimumBalance: Number(formData.get("minimumBalance")),
      dailyTransferLimit: Number(formData.get("dailyTransferLimit")),
      monthlyTransferLimit: Number(formData.get("monthlyTransferLimit")),
      interestRate: Number(formData.get("interestRate")),

      branch: String(formData.get("branch")),
    };

    setLoading(true);

    try {
      const result = await createCustomerBankAccount(accountData);

      if (result.success) {
        alert("Bank account created successfully!");
        router.push("/dashboard/staff/customers/");
      } else {
        alert(result.message || "Account creation failed!");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#003566] p-3 text-white">
              <Wallet size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                Create Bank Account
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a new bank account for the approved customer.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
              <UserRound size={20} className="text-[#003566]" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                ACCOUNT CRACK
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Customer ID</label>
                <input
                  type="text"
                  name="userId"
                  value={customerId}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Customer Email</label>
                <input
                  type="email"
                  name="userEmail"
                  value={customerEmail}
                  readOnly
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className={labelClass}>Staff Email</label>
                <input
                  type="email"
                  name="staffEmail"
                  value={staffEmail}
                  readOnly
                  className={readOnlyClass}
                />
              </div>
            </div>
          </section>


          {/* Account Information */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
              <CreditCard size={20} className="text-[#003566]" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Account Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Auto Generated Account Number */}
              <div>
                <label className={labelClass}>
                  Account Number (Auto Generated)
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    name="accountNumber"
                    value={accountNumber}
                    readOnly
                    required
                    placeholder="Generating..."
                    className={readOnlyClass}
                  />

                  <button
                    type="button"
                    onClick={regenerateAccountNumber}
                    title="Generate another number"
                    className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 px-3 text-[#003566] transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <RefreshCw size={17} />
                  </button>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Automatically generated 9-digit number.
                </p>
              </div>

              <div>
                <label className={labelClass}>Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  required
                  placeholder="Enter account name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Account Type</label>
                <select
                  name="accountType"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select account type
                  </option>
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                  <option value="Student">Student Account</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Currency</label>
                <select
                  name="currency"
                  defaultValue="BDT"
                  className={inputClass}
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Account Status</label>
                <select
                  name="status"
                  defaultValue="Active"
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Branch</label>
                <input
                  type="text"
                  name="branch"
                  required
                  placeholder="Enter branch name"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Account Purpose</label>
                <textarea
                  name="accountPurpose"
                  rows={3}
                  placeholder="Enter account purpose..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Financial Configuration */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
              <Banknote size={20} className="text-[#003566]" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Financial Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Initial Balance</label>
                <input
                  type="number"
                  name="balance"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                  required
                  placeholder="Enter initial balance"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Minimum Balance</label>
                <input
                  type="number"
                  name="minimumBalance"
                  min="0"
                  step="0.01"
                  defaultValue="500"
                  placeholder="Enter minimum balance"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Daily Transfer Limit</label>
                <input
                  type="number"
                  name="dailyTransferLimit"
                  min="0"
                  step="0.01"
                  placeholder="Enter daily limit"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Monthly Transfer Limit</label>
                <input
                  type="number"
                  name="monthlyTransferLimit"
                  min="0"
                  step="0.01"
                  placeholder="Enter monthly limit"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  min="0"
                  step="0.01"
                  placeholder="Enter interest rate"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="reset"
              onClick={() => setAccountNumber(generateAccountNumber())}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading || !accountNumber}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#003566] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00264a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 size={18} />
              {loading ? "Creating Account..." : "Create Bank Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApprovedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="text-sm text-gray-500">
            Loading account form...
          </div>
        </div>
      }
    >
      <ApprovedContent />
    </Suspense>
  );
}
