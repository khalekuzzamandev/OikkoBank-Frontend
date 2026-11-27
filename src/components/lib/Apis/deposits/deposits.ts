
"use server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Types
export interface CreateDepositData {
  depositAmount: number;
  currency: string;
  depositMethod: string;

  userId: string;
  userEmail: string;

  accountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  accountEmail: string;
  accountStatus: string;

  transactionType: "Deposit";
  transactionStatus: "Pending";
  transactionDate: string;
}

export interface DepositResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// API URL
const getApiURL = (endpoint: string): string => {
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  return `${baseURL.replace(/\/+$/, "")}${endpoint}`;
};

// Safely Parse JSON
const parseResponse = async <T>(
  response: Response
): Promise<DepositResponse<T>> => {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  if (!contentType.includes("application/json")) {
    console.error("Non-JSON API Response:", {
      status: response.status,
      contentType,
      body: responseText.slice(0, 300),
    });

    throw new Error(
      `Backend returned HTML or invalid response. HTTP ${response.status}. Check your API URL and backend routes.`
    );
  }

  let result: DepositResponse<T>;

  try {
    result = JSON.parse(responseText) as DepositResponse<T>;
  } catch {
    throw new Error("Backend returned invalid JSON.");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `API request failed: ${response.status}`
    );
  }

  return result;
};

// Create Deposit
export const createDeposit = async (
  depositData: CreateDepositData
): Promise<DepositResponse> => {
  try {
    const url = getApiURL("/api/deposits");

    console.log("Creating Deposit:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(depositData),
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch (error: unknown) {
    console.error("Create Deposit Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create deposit.",
    };
  }
};

// Get All Deposits
export const getAllDeposits = async (): Promise<
  DepositResponse<unknown[]>
> => {
  try {
    const url = getApiURL("/api/deposits");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    return await parseResponse<unknown[]>(response);
  } catch (error: unknown) {
    console.error("Get All Deposits Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch deposits.",
      data: [],
    };
  }
};

// Get Deposit By ID
export const getDepositById = async (
  id: string
): Promise<DepositResponse> => {
  try {
    if (!id.trim()) {
      throw new Error("Deposit ID is required.");
    }

    const url = getApiURL(
      `/api/deposits/${encodeURIComponent(id)}`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch (error: unknown) {
    console.error("Get Deposit By ID Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch deposit.",
    };
  }
};

// dleet deposit

export const deleteDeposit = async (
  id: string
): Promise<DepositResponse> => {
  try {
    if (!id.trim()) {
      throw new Error("Deposit ID is required.");
    }

    const url = getApiURL(
      `/api/deposits/${encodeURIComponent(id)}`
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch (error: unknown) {
    console.error("Delete Deposit Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete deposit.",
    };
  }
};


// update deposit

export interface UpdateDepositData {
  depositAmount?: number;
  currency?: string;
  depositMethod?: string;

  transactionStatus?: "Pending" | "Success" | "Completed" | "Failed";
  transactionDate?: string;

  description?: string;
}

export const updateDeposit = async (
  id: string,
  updateData: UpdateDepositData
): Promise<DepositResponse> => {
  try {
    if (!id.trim()) {
      throw new Error("Deposit ID is required.");
    }

    const url = getApiURL(
      `/api/deposits/${encodeURIComponent(id)}`
    );

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch (error: unknown) {
    console.error("Update Deposit Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update deposit.",
    };
  }
};
