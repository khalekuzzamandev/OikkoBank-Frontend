
"use client";

import { useState } from "react";
import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";

import {
  Wallet,
  ArrowLeftRight,
  ShieldCheck,
  Loader2,
  Info,
  CreditCard,
  CircleCheck,
} from "lucide-react";

import {
  getCustomerBankAccounts,
  updateCustomerBankAccount,
} from "@/components/lib/Apis/accounts/account";

const CustomerTransferBlance = () => {
  const {
    user,
    primaryAccount,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableBalance = Number(primaryAccount?.balance || 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (accountLoading) {
      setError("Please wait while account information loads.");
      return;
    }

    if (accountError || !primaryAccount || !user?.id) {
      setError("Your bank account could not be loaded.");
      return;
    }

    if (!primaryAccount._id) {
      setError("Sender account ID is missing.");
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      setError("Your bank account is not active.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const transferAmount = Number(formData.get("transferAmount"));

    const recipientAccountNumber = String(
      formData.get("recipientAccountNumber") || ""
    ).trim();

    // Amount Validation
    if (!Number.isFinite(transferAmount) || transferAmount < 500) {
      setError("Minimum transfer amount must be ৳500.");
      return;
    }

    // Balance Validation
    if (transferAmount > availableBalance) {
      setError("Insufficient account balance.");
      return;
    }

    // Recipient Account Validation
    if (!/^\d{9}$/.test(recipientAccountNumber)) {
      setError("Account number must be exactly 9 digits.");
      return;
    }

    // Prevent Own Account Transfer
    if (
      recipientAccountNumber ===
      String(primaryAccount.accountNumber).trim()
    ) {
      setError("You cannot transfer money to your own account.");
      return;
    }

    setLoading(true);

    try {
      // Get All Accounts
      const allUserAccount = await getCustomerBankAccounts();

      if (!allUserAccount || allUserAccount.success === false) {
        throw new Error(
          allUserAccount?.message || "Unable to fetch accounts."
        );
      }

      // Extract Accounts
      const accountsData = allUserAccount.data;

      const customerAccounts = Array.isArray(accountsData)
        ? accountsData
        : accountsData
          ? [accountsData]
          : [];

      // Find Receiver Account
      const recipientAccount = customerAccounts.find(
        (account) =>
          String(account.accountNumber || "").trim() ===
          recipientAccountNumber
      );

      if (!recipientAccount) {
        throw new Error("This account number is not registered.");
      }

      if (!recipientAccount._id) {
        throw new Error("Receiver account ID is missing.");
      }

      if (recipientAccount.status?.toLowerCase() !== "active") {
        throw new Error("Recipient bank account is not active.");
      }

      const senderBalance = Number(primaryAccount.balance || 0);
      const receiverBalance = Number(recipientAccount.balance || 0);

      if (
        !Number.isFinite(senderBalance) ||
        !Number.isFinite(receiverBalance)
      ) {
        throw new Error("Invalid account balance.");
      }

      if (transferAmount > senderBalance) {
        throw new Error("Insufficient account balance.");
      }

      // Calculate New Balances
      const newSenderBalance = senderBalance - transferAmount;
      const newReceiverBalance = receiverBalance + transferAmount;

      // Prepare Transfer Data
      const transferData = {
        transferAmount,
        recipientAccountNumber,

        recipientAccountId: recipientAccount._id,
        recipientAccountName: recipientAccount.accountName,
        recipientAccountType: recipientAccount.accountType,
        recipientEmail: recipientAccount.userEmail || "",

        userId: user.id,
        userEmail: user.email || primaryAccount.userEmail || "",

        accountId: primaryAccount._id,
        accountNumber: primaryAccount.accountNumber,
        accountName: primaryAccount.accountName,
        accountType: primaryAccount.accountType,

        availableBalance: senderBalance,

        transactionType: "Transfer",
        transactionStatus: "Completed",
        transactionDate: new Date().toISOString(),
      };

      // Step 1: Update Sender Balance
      const senderResult = await updateCustomerBankAccount(
        primaryAccount._id,
        {
          balance: newSenderBalance,
        }
      );

      if (!senderResult || senderResult.success === false) {
        throw new Error(
          senderResult?.message || "Sender balance update failed."
        );
      }

      // Step 2: Update Receiver Balance
      const receiverResult = await updateCustomerBankAccount(
        recipientAccount._id,
        {
          balance: newReceiverBalance,
        }
      );

      if (!receiverResult || receiverResult.success === false) {
        // Try to restore Sender Balance
        const rollbackResult = await updateCustomerBankAccount(
          primaryAccount._id,
          {
            balance: senderBalance,
          }
        );

        if (!rollbackResult || rollbackResult.success === false) {
          throw new Error(
            "Receiver update failed and sender rollback also failed. Please contact bank support immediately."
          );
        }

        throw new Error(
          receiverResult?.message ||
          "Receiver update failed. Sender balance was restored."
        );
      }

      // Transfer Successful
      console.log("TRANSFER SUCCESS:", transferData);

      console.log("Sender New Balance:", newSenderBalance);
      console.log("Receiver New Balance:", newReceiverBalance);

      setSuccess(
        `৳${transferAmount.toLocaleString("en-BD")} successfully transferred to ${recipientAccount.accountName}.`
      );

      form.reset();

      // Refresh Page Data
      window.location.reload();
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

      {/* Information */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 shrink-0 text-blue-700" size={20} />

          <div>
            <h3 className="font-semibold text-[#003566]">
              Transfer Information
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Minimum transfer amount is ৳500. You cannot transfer more
              than your available balance. Recipient account number
              must contain exactly 9 digits and must be registered.
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

          {/* Sender Account */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-2 text-[#003566]">
              <Wallet size={19} />
              <h3 className="font-semibold">Sender Account</h3>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              {primaryAccount.accountName}
            </p>

            <p className="text-sm text-slate-500">
              Account: {primaryAccount.accountNumber}
            </p>

            <p className="mt-2 font-bold text-[#003566]">
              Available Balance: ৳
              {availableBalance.toLocaleString("en-BD")}
            </p>
          </div>

          {/* Amount and Recipient */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Transfer Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transfer Amount ({primaryAccount.currency || "BDT"})
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">
                <Wallet
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="transferAmount"
                  min="500"
                  max={availableBalance}
                  step="0.01"
                  placeholder="Minimum ৳500"
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Minimum: ৳500
              </p>
            </div>

            {/* Recipient Account */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Recipient Account Number
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">
                <CreditCard
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="recipientAccountNumber"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Enter 9 digit account number"
                  required
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 9);

                    setError("");
                    setSuccess("");
                  }}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-600"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Account number must contain exactly 9 digits.
              </p>
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              <Info size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <ShieldCheck size={18} className="shrink-0" />
              {success}
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-green-600"
              size={20}
            />

            <p className="text-sm text-slate-600">
              Please verify your transfer amount and recipient account
              information before submitting.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
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
