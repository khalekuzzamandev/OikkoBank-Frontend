
"use server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface LoanResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Safely parse backend response
const handleResponse = async <T = unknown>(
  response: Response
): Promise<LoanResponse<T>> => {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(
      `Backend returned invalid response. HTTP ${response.status}. Check your API URL and backend routes.`
    );
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// Create Loan
export const createLoan = async <T = Record<string, unknown>>(
  loanData: T
): Promise<LoanResponse> => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");

    const response = await fetch(`${baseURL}/api/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
      cache: "no-store",
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create loan"
    );
  }
};

// Get All Loans
export const getAllLoans = async <T = unknown>(): Promise<LoanResponse<T>> => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");

    const response = await fetch(`${baseURL}/api/loans`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<T>(response);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch loans"
    );
  }
};

// Get Loan By ID
export const getLoanById = async <T = unknown>(
  id: string
): Promise<LoanResponse<T>> => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");
    if (!id) throw new Error("Loan ID is required");

    const response = await fetch(
      `${baseURL}/api/loans/${encodeURIComponent(id)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await handleResponse<T>(response);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch loan"
    );
  }
};

// Delete Loan
export const deleteLoan = async (
  id: string
): Promise<LoanResponse> => {
  try {
    if (!baseURL) throw new Error("Backend URL is not configured");
    if (!id) throw new Error("Loan ID is required");

    const response = await fetch(
      `${baseURL}/api/loans/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    return await handleResponse(response);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete loan"
    );
  }
};
