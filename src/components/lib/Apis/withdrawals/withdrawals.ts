
"use server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Create Withdraw
export const createWithdraw = async (withdrawData: Record<string, unknown>) => {
  try {
    const res = await fetch(`${baseURL}/api/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withdrawData),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create withdrawal");
    }

    return data;
  } catch (error: unknown) {
    console.error("Create Withdraw Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
};

// Get All Withdrawals
export const getAllWithdraws = async (userId?: string) => {
  try {
    const query = userId
      ? `?userId=${encodeURIComponent(userId)}`
      : "";
    const res = await fetch(`${baseURL}/api/withdrawals${query}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch withdrawals");
    }

    return data;
  } catch (error: unknown) {
    console.error("Get Withdrawals Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
};

// Get Withdraw By ID
export const getWithdrawById = async (id: string) => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");
    if (!id.trim()) throw new Error("Withdrawal ID is required");

    const res = await fetch(
      `${baseURL}/api/withdrawals/${encodeURIComponent(id)}`,
      {
      method: "GET",
      cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch withdrawal");
    }

    return data;
  } catch (error: unknown) {
    console.error("Get Withdraw By ID Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
};

export interface UpdateWithdrawData {
  transactionStatus: "Pending" | "Completed" | "Failed";
}

export const updateWithdraw = async (
  id: string,
  updateData: UpdateWithdrawData
) => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");
    if (!id.trim()) throw new Error("Withdrawal ID is required");

    const res = await fetch(
      `${baseURL}/api/withdrawals/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update withdrawal");
    }

    return data;
  } catch (error: unknown) {
    console.error("Update Withdrawal Error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update withdrawal",
    };
  }
};

// Delete Withdraw
export const deleteWithdraw = async (id: string) => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");
    if (!id.trim()) throw new Error("Withdrawal ID is required");

    const res = await fetch(
      `${baseURL}/api/withdrawals/${encodeURIComponent(id)}`,
      {
      method: "DELETE",
      cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete withdrawal");
    }

    return data;
  } catch (error: unknown) {
    console.error("Delete Withdraw Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
};




