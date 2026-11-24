
"use server";

// Types
export interface BankAccount {
  _id?: string;
  userId: string;
  userEmail: string;
  staffId: string;
  staffEmail: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency: string;
  status: string;
  accountPurpose?: string;
  balance: number;
  minimumBalance: number;
  dailyTransferLimit: number;
  monthlyTransferLimit: number;
  interestRate: number;
  branch: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Create Account - POST
export const createCustomerBankAccount = async (
  accountData: BankAccount
) => {
  try {
    const res = await fetch(`${baseURL}/api/accounts/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Account creation failed");

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

// Get All Accounts - GET
export const getCustomerBankAccounts = async () => {
  try {
    const res = await fetch(`${baseURL}/api/accounts`, {
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch accounts");

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

// Get Single Account - GET
export const getCustomerBankAccountById = async (id: string) => {
  try {
    const res = await fetch(`${baseURL}/api/accounts/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Account not found");

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

// Update Account - PUT
export const updateCustomerBankAccount = async (
  id: string,
  accountData: Partial<BankAccount>
) => {
  try {
    const res = await fetch(`${baseURL}/api/accounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Account update failed");

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
