
"use client";

import { useEffect, useState } from "react";
import getAllUser from "@/components/lib/Apis/users/users";
import {
  Search,
  Eye,
  MoreHorizontal,
  Users,
  UserCheck,
  Clock,
} from "lucide-react";

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  image?: string;
}

const Page = () => {
  const [users, setUsers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();

        const allUsers: Customer[] = Array.isArray(data)
          ? data
          : data?.users || [];

        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Only customers
  const customerUsers = users.filter(
    (item) => item.role?.toLowerCase() === "customer"
  );

  // Search and status filter
  const filteredUsers = customerUsers.filter((item) => {
    const matchesSearch = `${item.name || ""} ${item.email || ""} ${item.phone || ""
      } ${item._id}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const activeCustomers = customerUsers.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  const pendingCustomers = customerUsers.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const filters = [
    { label: "All", count: customerUsers.length },
    { label: "Active", count: activeCustomers },
    { label: "Pending", count: pendingCustomers },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#003b68]">
              Customer Accounts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all registered bank customers.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#003b68] shadow-sm">
            <Users size={18} />
            Total Customers: {customerUsers.length}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Customers</p>
              <div className="rounded-lg bg-blue-50 p-2 text-[#003b68]">
                <Users size={20} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#003b68]">
              {customerUsers.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Customers</p>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <UserCheck size={20} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-green-600">
              {activeCustomers}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending Customers</p>
              <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
                <Clock size={20} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-orange-500">
              {pendingCustomers}
            </h2>
          </div>

        </div>

        {/* Customer Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Search & Filters */}
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 xl:flex-row xl:items-center">

            <div>
              <h2 className="font-bold text-[#003b68]">
                All Customers
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                View and manage registered customer accounts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#003b68] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
                {filters.map((filter) => (
                  <button
                    key={filter.label}
                    onClick={() => setStatusFilter(filter.label)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${statusFilter === filter.label
                        ? "bg-[#003b68] text-white shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-[#003b68]"
                      }`}
                  >
                    {filter.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === filter.label
                          ? "bg-white/20 text-white"
                          : "bg-white text-gray-500"
                        }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-[#f7f9fc]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Account ID</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-sm text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-blue-50/40"
                    >

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#003b68] text-sm font-bold text-white">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Customer"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              item.name?.charAt(0).toUpperCase() || "U"
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.name || "Unknown"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.phone || "N/A"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-[#003b68]">
                          {item.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.status?.toLowerCase() === "active"
                              ? "bg-green-50 text-green-600"
                              : item.status?.toLowerCase() === "pending"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {item.status || "Unknown"}
                        </span>
                      </td>

                      {/* Account ID */}
                      <td className="px-5 py-4 text-sm font-medium text-[#003b68]">
                        {item._id}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="View customer"
                            className="rounded-lg p-2 text-[#003b68] transition hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="More options"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                          >
                            <MoreHorizontal size={19} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <Users size={35} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">
                        No {statusFilter === "All" ? "" : statusFilter.toLowerCase()} customers found
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Try another search or status filter.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              Showing {filteredUsers.length} of {customerUsers.length} customers
            </p>

            <p className="text-xs font-medium text-[#003b68]">
              Oikko Bank · Customer Management
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
