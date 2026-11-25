
"use client";

import React, { useState } from "react";
import {
  Wallet,
  Banknote,
  ArrowUpFromLine,
  ShieldCheck,
  Loader2,
  LockKeyhole,
  CreditCard,
  Info,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";

const CustomerwithdrawalsPage = () => {
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
      alert("Please wait. Your account is loading.");
      return;
    }

    if (accountError) {
      alert("Unable to load your bank account. Please try again.");
      return;
    }

    if (!user?.id || !primaryAccount) {
      alert("Bank account not found. Please login again.");
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      alert("Your bank account is not active.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const withdrawalAmount = Number(formData.get("withdrawalAmount"));
    const transactionPassword = String(
      formData.get("transactionPassword") || ""
    ).trim();

    const recipientAccountNumber = String(
      formData.get("recipientAccountNumber") || ""
    ).trim();

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawalAmount > Number(primaryAccount.balance)) {
      alert("Insufficient account balance.");
      return;
    }

    if (!transactionPassword) {
      alert("Please enter your transaction password.");
      return;
    }

    if (!recipientAccountNumber) {
      alert("Please enter recipient account number.");
      return;
    }

    setLoading(true);

    // Never include transaction password in logs or transaction records.
    const withdrawalData = {
      withdrawalAmount,
      currency: primaryAccount.currency || "BDT",
      withdrawalMethod: "Branch Cash Withdrawal",
      recipientAccountNumber,

      userId: user.id,
      userEmail: user.email || primaryAccount.userEmail || "",

      accountId: primaryAccount._id || "",
      accountNumber: primaryAccount.accountNumber,
      accountName: primaryAccount.accountName,
      accountType: primaryAccount.accountType,
      accountEmail: primaryAccount.userEmail,
      accountStatus: primaryAccount.status,

      transactionType: "Withdrawal",
      transactionStatus: "Pending",
      transactionDate: new Date().toISOString(),
    };

    console.log("Customer Withdrawal Data:", withdrawalData);

    setTimeout(() => {
      setLoading(false);
      form.reset();

      alert(
        "Withdrawal request submitted successfully! Status: Pending."
      );
    }, 500);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1762AE] focus:bg-white focus:ring-4 focus:ring-blue-50";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003566] text-white shadow-lg shadow-blue-900/15">
              <ArrowUpFromLine size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Withdraw Money
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Request a branch cash withdrawal from your bank account.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-[#1762AE] shadow-sm">
            <ShieldCheck size={16} />
            Secure Banking
          </div>
        </div>

        {/* Information Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Info size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Branch Cash Withdrawal
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              Enter your withdrawal amount, transaction password and recipient
              account number. Your request will be reviewed by the bank.
            </p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 p-5 sm:p-8">

            {/* Section Heading */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#003566]">
                  Withdrawal Details
                </h2>

                <p className="text-xs text-gray-500">
                  Enter the required information for your withdrawal.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Withdrawal Amount */}
              <div>
                <label className={labelClass}>
                  Withdrawal Amount (৳){" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">
                    ৳
                  </span>

                  <input
                    name="withdrawalAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter withdrawal amount"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Transaction Password */}
              <div>
                <label className={labelClass}>
                  Transaction Password{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="transactionPassword"
                    type="password"
                    required
                    autoComplete="off"
                    placeholder="Enter transaction password"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Recipient Account Number */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Recipient Account Number{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <CreditCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="recipientAccountNumber"
                    type="text"
                    required
                    placeholder="Enter recipient account number"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              Your withdrawal request will be reviewed by the bank.
            </div>

            <button
              type="submit"
              disabled={loading || accountLoading || !!accountError}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || accountLoading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : (
                <Banknote size={19} />
              )}

              {accountLoading
                ? "Loading Account..."
                : loading
                  ? "Submitting..."
                  : "Submit Withdrawal Request"}
            </button>
          </div>
        </form>

        {/* Bottom Note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-[#1762AE]"
          />

          <p className="text-xs leading-5 text-gray-500">
            Your withdrawal request will remain{" "}
            <strong className="text-amber-600">Pending</strong> until the bank
            verifies and processes it. Your account balance will not be
            deducted at this stage.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerwithdrawalsPage;
