
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserRound,
  Wallet,
  CreditCard,
  Banknote,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { createCustomerBankAccount } from "@/components/lib/Apis/accounts/account";
import { editUser } from "@/components/lib/Apis/users/users";

interface Customer {
  _id: string;
  name: string;
  email: string;
  status: string;
  [key: string]: unknown;
}

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
  const staffEmail = searchParams.get("staffEmail") || "";

  const [customerResult, setCustomerResult] = useState<{
    customerId: string;
    customer: Customer | null;
  } | null>(null);
  const customerLoading = Boolean(customerId) && customerResult?.customerId !== customerId;
  const customer = customerResult?.customerId === customerId
    ? customerResult.customer
    : null;

  const [accountNumber, setAccountNumber] = useState(
    generateAccountNumber
  );

  const [loading, setLoading] = useState(false);

  // Fetch users and match only the requested customer
  useEffect(() => {
    if (!customerId) return;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    let isMounted = true;

    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/users`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();

        const users: Customer[] = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.users)
              ? result.users
              : [];

        const matchedUser = users.find(
          (user) => String(user._id) === String(customerId)
        );

        if (isMounted) {
          setCustomerResult({
            customerId,
            customer: matchedUser || null,
          });
        }
      } catch (error) {
        console.error("Customer fetch error:", error);

        if (isMounted) {
          setCustomerResult({ customerId, customer: null });
        }
      }
    };

    fetchCustomer();

    return () => {
      isMounted = false;
    };
  }, [customerId]);

  const regenerateAccountNumber = () => {
    setAccountNumber(generateAccountNumber());
  };

  // Create account and activate matched customer
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!customerId || !customer?._id) {
      alert("Customer not found!");
      return;
    }

    if (String(customer._id) !== String(customerId)) {
      alert("Customer ID does not match!");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const accountData = {
      userId: customer._id,
      userEmail: customer.email,
      staffEmail,
      accountNumber: String(formData.get("accountNumber")),
      accountName: String(formData.get("accountName")),
      accountType: String(formData.get("accountType")),
      currency: String(formData.get("currency")),
      status: String(formData.get("status")),
      accountPurpose: String(formData.get("accountPurpose") || ""),
      balance: Number(formData.get("balance") || 0),
      minimumBalance: Number(formData.get("minimumBalance") || 0),
      dailyTransferLimit: Number(
        formData.get("dailyTransferLimit") || 0
      ),
      monthlyTransferLimit: Number(
        formData.get("monthlyTransferLimit") || 0
      ),
      interestRate: Number(formData.get("interestRate") || 0),
      branch: String(formData.get("branch")),
    };

    setLoading(true);

    try {
      // Step 1: Create bank account
      const accountResult =
        await createCustomerBankAccount(accountData);

      if (!accountResult?.success) {
        alert(
          accountResult?.message || "Account creation failed!"
        );
        return;
      }

      // Step 2: Activate only the matched customer
      const userResult = await editUser(customer._id, {
        status: "active",
      });

      if (!userResult?.success) {
        console.error("User status update failed:", userResult);

        alert(
          "Account created successfully, but customer status update failed: " +
          (userResult?.message || "Unknown error")
        );

        return;
      }

      // Step 3: Update local customer state
      setCustomerResult((previous) =>
        previous?.customerId === customerId && previous.customer
          ? {
              ...previous,
              customer: { ...previous.customer, status: "active" },
            }
          : previous
      );

      alert(
        "Bank account created and customer activated successfully!"
      );

      router.push("/dashboard/staff/customers/");
      router.refresh();
    } catch (error) {
      console.error("Account creation error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
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

        {/* Customer Loading */}
        {customerLoading ? (
          <div className="flex min-h-60 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              Loading customer information...
            </div>
          </div>
        ) : !customer ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">
            <p className="font-semibold text-red-600">
              Customer not found!
            </p>
            <p className="mt-2 text-sm text-gray-500">
              No user matched with customer ID: {customerId || "Missing ID"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
                <UserRound size={20} className="text-[#003566]" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Customer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>Customer ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={customer._id}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={customer.name || ""}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Customer Email</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={customer.email || ""}
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

                <div>
                  <label className={labelClass}>Customer Status</label>
                  <input
                    type="text"
                    value={customer.status || "Unknown"}
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
                      className={readOnlyClass}
                    />

                    <button
                      type="button"
                      onClick={regenerateAccountNumber}
                      disabled={loading}
                      title="Generate another number"
                      className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 px-3 text-[#003566] transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
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
                    defaultValue={customer.name || ""}
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
                    <option value="Salary">Salary Account</option>
                    <option value="Student">Student Account</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
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
                    defaultValue="0"
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
                    defaultValue="0"
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
                    defaultValue="0"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="reset"
                disabled={loading}
                onClick={regenerateAccountNumber}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={loading || !accountNumber || !customer}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#003566] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00264a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}

                {loading ? "Creating Account..." : "Create Bank Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ApprovedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Loading account form...
          </div>
        </div>
      }
    >
      <ApprovedContent />
    </Suspense>
  );
}
