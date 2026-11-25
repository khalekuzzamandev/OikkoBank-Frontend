
"use client";

import { useState } from "react";
import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";

import {
  Wallet,
  LockKeyhole,
  ArrowLeftRight,
  ShieldCheck,
  Loader2,
  Info,
  CreditCard,
  UserRound,
  Banknote,
  CircleCheck,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const CustomerTransferBlance = () => {
  const {
    user,
    primaryAccount,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [transferMethod, setTransferMethod] = useState("Bank Transfer");
  const [loading, setLoading] = useState(false);

  const availableBalance = Number(primaryAccount?.balance || 0);
  const amount = Number(transferAmount);

  const isAmountValid =
    transferAmount !== "" &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= availableBalance;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountLoading) {
      alert("Please wait while account information loads.");
      return;
    }

    if (accountError || !primaryAccount || !user?.id) {
      alert("Your bank account could not be loaded.");
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      alert("Your bank account is not active.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid transfer amount.");
      return;
    }

    if (amount > availableBalance) {
      alert(
        `Insufficient balance! Your available balance is ৳${availableBalance.toLocaleString("en-BD")}.`
      );
      return;
    }

    if (!recipientAccountNumber.trim()) {
      alert("Enter recipient account number.");
      return;
    }

    if (
      recipientAccountNumber.trim() ===
      primaryAccount.accountNumber
    ) {
      alert("You cannot transfer money to your own account.");
      return;
    }

    if (!transactionPassword.trim()) {
      alert("Enter your transaction password.");
      return;
    }

    try {
      setLoading(true);

      const transferPayload = {
        userId: user.id,
        userEmail: user.email || primaryAccount.userEmail || "",

        accountId: primaryAccount._id || "",
        accountNumber: primaryAccount.accountNumber,
        accountName: primaryAccount.accountName,
        accountType: primaryAccount.accountType,
        accountEmail: primaryAccount.userEmail,
        accountStatus: primaryAccount.status,

        availableBalance,
        transferAmount: amount,
        currency: primaryAccount.currency || "BDT",

        recipientAccountNumber: recipientAccountNumber.trim(),
        transferMethod,

        transactionPassword,

        transactionType: "Transfer",
        transactionStatus: "Pending",
        transactionDate: new Date().toISOString(),
      };

      const response = await fetch(
        `${BASE_URL}/api/create-transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transferPayload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Transfer request failed."
        );
      }

      console.log("Customer Transfer Data:", result.data);

      alert("Transfer request submitted successfully!");

      setTransferAmount("");
      setRecipientAccountNumber("");
      setTransactionPassword("");
      setTransferMethod("Bank Transfer");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (accountLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-blue-700" size={35} />
      </div>
    );
  }

  if (accountError || !primaryAccount) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {accountError || "No bank account found."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003566]">
          Transfer Money
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Transfer money securely from your bank account.
        </p>
      </div>

      {/* Available Balance Card */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#003566] to-[#1762AE] p-6 text-white shadow-md">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Wallet size={19} />
              Available Balance
            </div>

            <h2 className="mt-3 text-3xl font-bold">
              {primaryAccount.currency || "BDT"}{" "}
              {availableBalance.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Your current available account balance
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Banknote size={30} />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="text-[#1762AE]" size={21} />

          <h2 className="font-bold text-slate-900">
            Your Account Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Account Name</p>
            <p className="mt-1 font-semibold text-slate-800">
              {primaryAccount.accountName}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Account Number</p>
            <p className="mt-1 font-semibold text-slate-800">
              {primaryAccount.accountNumber}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Account Type</p>
            <p className="mt-1 font-semibold text-slate-800">
              {primaryAccount.accountType}
            </p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 shrink-0 text-blue-700" size={20} />

          <div>
            <h3 className="font-semibold text-[#003566]">
              Transfer Information
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              You cannot transfer more than your available balance.
              Your transfer request will remain pending until it is
              reviewed and approved.
            </p>
          </div>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-[#1762AE]">
            <ArrowLeftRight size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Transfer Request
            </h2>

            <p className="text-sm text-slate-500">
              Enter the recipient and transfer details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Transfer Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transfer Amount ({primaryAccount.currency || "BDT"})
              </label>

              <div className="relative">
                <Wallet
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0.01"
                  max={availableBalance}
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter transfer amount"
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
                />
              </div>

              {transferAmount !== "" && (
                <p
                  className={`mt-2 text-xs font-medium ${isAmountValid ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {isAmountValid
                    ? `Remaining balance: ৳${(availableBalance - amount).toLocaleString("en-BD")}`
                    : `Amount cannot exceed ৳${availableBalance.toLocaleString("en-BD")}`}
                </p>
              )}
            </div>

            {/* Transfer Method */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transfer Method
              </label>

              <select
                value={transferMethod}
                onChange={(e) => setTransferMethod(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Internal Transfer">
                  Internal Transfer
                </option>
              </select>
            </div>

            {/* Recipient Account */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Recipient Account Number
              </label>

              <div className="relative">
                <CreditCard
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={recipientAccountNumber}
                  onChange={(e) =>
                    setRecipientAccountNumber(e.target.value)
                  }
                  placeholder="Enter recipient account number"
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
                />
              </div>
            </div>

            {/* Transaction Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transaction Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={transactionPassword}
                  onChange={(e) =>
                    setTransactionPassword(e.target.value)
                  }
                  placeholder="Enter transaction password"
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Balance Warning */}
          {amount > availableBalance && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              Insufficient balance! Please enter an amount within
              your available balance.
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-green-600"
              size={20}
            />

            <p className="text-sm text-slate-600">
              Your transaction password will be verified securely.
              It will not be stored with the transfer request.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              !isAmountValid ||
              primaryAccount.status?.toLowerCase() !== "active"
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003566] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CircleCheck size={19} />
                Submit Transfer Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerTransferBlance;
