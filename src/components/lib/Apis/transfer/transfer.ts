
"use server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Types
export interface CreateTransferData {
  userId: string;
  userEmail: string;

  accountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;

  recipientAccountId: string;
  recipientAccountNumber: string;
  recipientAccountName: string;
  recipientAccountType: string;
  recipientEmail: string;

  transferAmount: number;
  currency: string;

  transactionType: "Transfer";
  transactionStatus: "Pending" | "Completed" | "Failed";
  transactionDate?: string;
}

export interface TransferUpdateData {
  transactionStatus?: "Pending" | "Completed" | "Failed";
  transferAmount?: number;
  [key: string]: unknown;
}

// Create Transfer - POST
export const createTransfer = async (
  transferData: CreateTransferData
) => {
  try {
    const res = await fetch(`${baseURL}/api/transfers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Transfer creation failed.");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};

// Get All Transfers - GET
export const getAllTransfers = async () => {
  try {
    const res = await fetch(`${baseURL}/api/transfers`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch transfers.");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};

// Get Transfer By ID - GET
export const getTransferById = async (id: string) => {
  try {
    const res = await fetch(`${baseURL}/api/transfers/${id}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transfer not found.");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};

// Update Transfer - PATCH
export const updateTransfer = async (
  id: string,
  updateData: TransferUpdateData
) => {
  try {
    const res = await fetch(`${baseURL}/api/transfers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transfer update failed.");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};

// Delete Transfer - DELETE
export const deleteTransfer = async (id: string) => {
  try {
    const res = await fetch(`${baseURL}/api/transfers/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transfer deletion failed.");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};
