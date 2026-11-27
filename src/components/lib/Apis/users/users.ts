
"use server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// get all users
const getAllUser = async () => {
  const users = await fetch(`${baseURL}/api/users`);
  if (!users.ok) {
    throw new Error("Failed to fetch users");
  }
  return users.json();
};
export default getAllUser;


// Get single user by ID
export const getUserById = async (customerId: string) => {
  try {
    const res = await fetch(`${baseURL}/api/users/${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch customer");
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Something went wrong!"
    );
  }
};
// Delete user
export const deleteUser = async (customerId: string) => {
  try {
    const res = await fetch(`${baseURL}/api/users/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete customer");
    }

    return {
      success: true,
      message: result.message || "Customer deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong!",
    };
  }
};

// Edit / Update user
export const editUser = async (
  customerId: string,
  userData: Record<string, unknown>
) => {
  try {
    const res = await fetch(`${baseURL}/api/users/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result?.success === false) {
      throw new Error(result.message || "Failed to update customer");
    }

    return {
      success: true,
      message: result.message || "Customer updated successfully",
      data: result.data || result.user || result.customer || result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong!",
    };
  }
};