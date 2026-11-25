
"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/Redux/hooks";
import { selectUser } from "@/Redux/features/UserSlice";
import { getCustomerBankAccountByUserId } from "@/components/lib/Apis/accounts/account";

export type UserBankAccount = {
  _id?: string;
  id?: string;
  userId: string;
  userEmail?: string;
  accountNumber?: string;
  accountName?: string;
  accountType?: string;
  currency?: string;
  status?: string;
  balance?: number | string;
  interestRate?: number | string;
  branch?: string;
  minimumBalance?: number;
  dailyTransferLimit?: number;
  monthlyTransferLimit?: number;
};

function isAccount(value: unknown): value is UserBankAccount {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof value.userId === "string"
  );
}

function extractAccounts(payload: unknown): UserBankAccount[] {
  if (Array.isArray(payload)) {
    return payload.filter(isAccount);
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const response = payload as Record<string, unknown>;

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to fetch accounts."
    );
  }

  for (const key of ["accounts", "account", "data"]) {
    const value = response[key];

    if (Array.isArray(value)) {
      return value.filter(isAccount);
    }

    if (isAccount(value)) {
      return [value];
    }

    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;

      if (Array.isArray(nested.accounts)) {
        return nested.accounts.filter(isAccount);
      }

      if (isAccount(nested.account)) {
        return [nested.account];
      }
    }
  }

  if (isAccount(payload)) {
    return [payload];
  }

  return [];
}

export function useLoggedInUserAccounts() {
  const user = useAppSelector(selectUser);

  const [accounts, setAccounts] = useState<UserBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      if (!user?.id) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getCustomerBankAccountByUserId(user.id);

        const allAccounts = extractAccounts(response);

        // Only logged-in user's accounts
        const myAccounts = allAccounts.filter(
          (account) => account.userId === user.id
        );

        if (active) {
          setAccounts(myAccounts);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load bank accounts."
          );
          setAccounts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchAccounts();

    return () => {
      active = false;
    };
  }, [user?.id]);

  return {
    user,
    accounts,
    loading,
    error,
    primaryAccount: accounts[0] || null,
  };
}
