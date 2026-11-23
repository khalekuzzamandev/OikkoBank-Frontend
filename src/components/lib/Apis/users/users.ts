
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

// get unic user
