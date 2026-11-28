"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/components/lib/Apis/users/users";

export default function DeleteCustomer({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const result = await deleteUser(customerId);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete customer.");
      }

      router.push("/dashboard/staff/customers");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete customer."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleDelete()}
        disabled={deleting}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Trash2 size={15} />
        )}
        Delete
      </button>
      {error && (
        <p
          role="alert"
          className="flex max-w-xs items-center gap-1 text-right text-xs text-red-600"
        >
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
