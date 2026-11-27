
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
    const res = await fetch(`${baseURL}/api/withdrawals/${id}`, {
      method: "GET",
      cache: "no-store",
    });

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


// Delete Withdraw
export const deleteWithdraw = async (id: string) => {
  try {
    const res = await fetch(`${baseURL}/api/withdrawals/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

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

