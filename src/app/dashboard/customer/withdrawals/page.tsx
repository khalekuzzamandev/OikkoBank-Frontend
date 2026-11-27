
"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  Banknote,
  ArrowUpFromLine,
  ShieldCheck,
  Loader2,
  Info,
  ReceiptText,
  CheckCircle2,
  UserRound,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";
import { createWithdraw } from "@/components/lib/Apis/withdrawals/withdrawals";
import { getCustomerBankAccounts } from "@/components/lib/Apis/accounts/account";

interface BankAccount {
  _id: string;
  userId?: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency?: string;
  status: string;
  balance: number;
  userEmail?: string;
}

const CustomerwithdrawalsPage = () => {
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [receiptNumber, setReceiptNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [allAccounts, setAllAccounts] = useState<BankAccount[]>([]);

  const [withdrawalAccount, setWithdrawalAccount] =
    useState<BankAccount | null>(null);

  const {
    user,
    primaryAccount,
    loading: userLoading,
    error: userError,
  } = useLoggedInUserAccounts();

  // Logged-in User Account Information
  const senderUserId = user?.id || "";

  const senderAccountNumber =
    primaryAccount?.accountNumber || "";

  const senderCurrentBalance = Number(
    primaryAccount?.balance ?? 0
  );

  // Check Own Account
  const isOwnAccount = (account: BankAccount) => {
    if (
      account.userId &&
      account.userId === senderUserId
    ) {
      return true;
    }

    if (
      user?.email &&
      account.userEmail &&
      account.userEmail.trim().toLowerCase() ===
      user.email.trim().toLowerCase()
    ) {
      return true;
    }

    return false;
  };

  // Fetch All Bank Accounts
  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      setAccountLoading(true);

      try {
        const result = await getCustomerBankAccounts();

        if (!result || result.success === false) {
          throw new Error(
            result?.message || "Failed to fetch bank accounts."
          );
        }

        const accountList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.accounts)
              ? result.accounts
              : [];

        if (active) {
          setAllAccounts(accountList);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load bank accounts."
          );
        }
      } finally {
        if (active) {
          setAccountLoading(false);
        }
      }
    };

    void fetchAccounts();

    return () => {
      active = false;
    };
  }, []);

  // Account Number Change
  const handleReceiptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiptNumber(e.target.value);
    setWithdrawalAccount(null);
    setError("");
    setSuccess("");
  };

  // Verify Other Person's Account
  const handleAccountLookup = () => {
    setError("");
    setSuccess("");
    setWithdrawalAccount(null);

    const number = receiptNumber.trim();

    if (!number) {
      setError("Please enter another person's account number.");
      return;
    }

    if (userLoading || !user?.id || !user?.email) {
      setError("Unable to verify your login. Please login again.");
      return;
    }

    if (!senderAccountNumber) {
      setError("Your sender account number was not found.");
      return;
    }

    const matchedAccount = allAccounts.find(
      (account) =>
        account.accountNumber?.trim() === number
    );

    if (!matchedAccount) {
      setError("Invalid account number. Account not found.");
      return;
    }

    if (matchedAccount.status?.toLowerCase() !== "active") {
      setError("This bank account is not active.");
      return;
    }

    if (isOwnAccount(matchedAccount)) {
      setError(
        "You cannot withdraw money from your own bank account."
      );
      return;
    }

    setWithdrawalAccount(matchedAccount);
  };

  // Submit Withdrawal
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (userLoading || accountLoading) {
      setError("Please wait. Account information is loading.");
      return;
    }

    if (userError || !user?.id || !user?.email) {
      setError("Unable to verify your login. Please login again.");
      return;
    }

    if (!primaryAccount?.accountNumber) {
      setError("Your sender account number was not found.");
      return;
    }

    if (!withdrawalAccount) {
      setError("Please verify the account number first.");
      return;
    }

    // Verify Target Account Again
    const matchedAccount = allAccounts.find(
      (account) =>
        account.accountNumber?.trim() === receiptNumber.trim() &&
        account._id === withdrawalAccount._id
    );

    if (!matchedAccount) {
      setError("Account verification failed.");
      return;
    }

    if (matchedAccount.status?.toLowerCase() !== "active") {
      setError("The selected bank account is not active.");
      return;
    }

    if (isOwnAccount(matchedAccount)) {
      setWithdrawalAccount(null);
      setError(
        "You cannot withdraw money from your own bank account."
      );
      return;
    }

    // Validate Withdrawal Amount
    const withdrawalAmount = Number(amount);

    if (
      !Number.isFinite(withdrawalAmount) ||
      withdrawalAmount < 500
    ) {
      setError("Minimum withdrawal amount must be ৳500.");
      return;
    }

    // Check Logged-in User Current Balance
    if (
      !Number.isFinite(senderCurrentBalance) ||
      senderCurrentBalance < 0
    ) {
      setError("Unable to verify your current account balance.");
      return;
    }

    if (withdrawalAmount > senderCurrentBalance) {
      setError(
        `Insufficient balance! Your current balance is ৳${senderCurrentBalance.toLocaleString("en-BD")}. You cannot withdraw more than your available balance.`
      );
      return;
    }

    setLoading(true);

    try {
      const withdrawalData = {
        // Withdrawal Amount
        amount: withdrawalAmount,
        withdrawalAmount,

        // Sender Information (Logged-in User)
        senderUserId: user.id,
        senderAccountNumber: senderAccountNumber,
        senderCurrentBalance: senderCurrentBalance,

        // Receipt Number = Logged-in User's Account Number
        receiptNumber: senderAccountNumber,

        // Other Person's Account Information
        accountId: matchedAccount._id,
        accountNumber: matchedAccount.accountNumber,
        accountName: matchedAccount.accountName,
        accountType: matchedAccount.accountType,
        accountEmail: matchedAccount.userEmail,
        accountStatus: matchedAccount.status,

        // Logged-in User Information
        userId: user.id,
        userEmail: user.email,

        // Transaction Information
        currency: matchedAccount.currency || "BDT",
        withdrawalMethod: "Branch Cash Withdrawal",
        transactionType: "Withdrawal",
        transactionStatus: "Pending",
        transactionDate: new Date().toISOString(),
      };

      const result = await createWithdraw(withdrawalData);

      if (!result || result.success === false) {
        throw new Error(
          result?.message ||
          "Failed to submit withdrawal request."
        );
      }

      setSuccess(
        result.message ||
        "Withdrawal request submitted successfully!"
      );

      setAmount("");
      setReceiptNumber("");
      setWithdrawalAccount(null);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1762AE] focus:bg-white focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  const isReceiptValid = !!withdrawalAccount;

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003566] text-white shadow-lg">
              <ArrowUpFromLine size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Withdraw Money
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Request a branch cash withdrawal from another bank account.
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
              Enter another person&apos;s active bank account number
              to request a withdrawal. You cannot withdraw from
              your own account using this service. Minimum amount is ৳500.
            </p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 p-5 sm:p-8">

            {/* Heading */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#003566]">
                  Withdrawal Details
                </h2>

                <p className="text-xs text-gray-500">
                  Verify another person&apos;s account and enter withdrawal amount.
                </p>
              </div>
            </div>

            {/* Current Balance */}
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Your Current Balance
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-[#003566]">
                    {userLoading ? (
                      <Loader2 className="animate-spin" size={22} />
                    ) : (
                      `৳${senderCurrentBalance.toLocaleString("en-BD")}`
                    )}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1762AE]">
                  <Wallet size={25} />
                </div>
              </div>

              <p className="mt-2 text-xs text-blue-700">
                You cannot withdraw more than your current balance.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Amount */}
              <div>
                <label className={labelClass}>
                  Withdrawal Amount (৳)
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">
                    ৳
                  </span>

                  <input
                    name="withdrawalAmount"
                    type="number"
                    min="500"
                    max={senderCurrentBalance}
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Minimum ৳500"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="mt-2 text-xs font-medium text-gray-500">
                  Minimum ৳500 · Maximum ৳
                  {senderCurrentBalance.toLocaleString("en-BD")}
                </p>

                {amount && Number(amount) > senderCurrentBalance && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    Amount exceeds your available balance.
                  </p>
                )}
              </div>

              {/* Target Account Number */}
              <div>
                <label className={labelClass}>
                  Other Person&apos;s Account Number
                  <span className="text-red-500"> *</span>
                </label>

                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <ReceiptText
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      name="targetAccountNumber"
                      type="text"
                      autoComplete="off"
                      value={receiptNumber}
                      onChange={handleReceiptChange}
                      maxLength={32}
                      required
                      placeholder="Enter other account number"
                      className={`${inputClass} pl-11 ${receiptNumber.trim() && !isReceiptValid
                          ? "border-red-400"
                          : isReceiptValid
                            ? "border-green-500"
                            : ""
                        }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAccountLookup}
                    disabled={
                      accountLoading ||
                      userLoading ||
                      !receiptNumber.trim()
                    }
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#003566] px-4 text-sm font-bold text-white transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {accountLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Your own account number is not allowed.
                </p>
              </div>
            </div>

            {/* Verified Account */}
            {withdrawalAccount && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="mb-4 flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={21} />

                  <h3 className="text-sm font-bold">
                    Account Verified Successfully
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <UserRound size={20} className="text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Account Holder
                      </p>

                      <p className="text-sm font-bold text-gray-800">
                        {withdrawalAccount.accountName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Account Number
                    </p>

                    <p className="text-sm font-bold text-gray-800">
                      {withdrawalAccount.accountNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Account Type
                    </p>

                    <p className="text-sm font-bold text-gray-800">
                      {withdrawalAccount.accountType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="text-sm font-bold text-green-700">
                      {withdrawalAccount.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <Info size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <ShieldCheck size={18} className="shrink-0" />
                {success}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:px-8">

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              Your withdrawal request will be reviewed by the bank.
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                accountLoading ||
                userLoading ||
                !!userError ||
                !senderAccountNumber ||
                !isReceiptValid ||
                !amount ||
                Number(amount) > senderCurrentBalance ||
                Number(amount) < 500
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : (
                <Banknote size={19} />
              )}

              {loading
                ? "Submitting..."
                : accountLoading || userLoading
                  ? "Loading Accounts..."
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
            <strong className="text-amber-600">Pending</strong> until
            the bank verifies and processes it. Your account balance
            will not be deducted at this stage.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerwithdrawalsPage;
