"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Loader2, Pencil, X } from "lucide-react";
import { editUser } from "@/components/lib/Apis/users/users";

type CustomerData = Record<string, unknown>;

type Props = {
  customerId: string;
  initialData: CustomerData;
  onUpdated: (changes: CustomerData) => void;
};

const getText = (data: CustomerData, key: string) => {
  const value = data[key];
  return typeof value === "string" ? value : "";
};

export default function EditCutomer({
  customerId,
  initialData,
  onUpdated,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const changes = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
    };

    if (!changes.name || !changes.email) {
      setError("Name and email are required.");
      return;
    }

    setSaving(true);

    try {
      const result = await editUser(customerId, changes);
      if (!result.success) {
        throw new Error(result.message || "Failed to update customer.");
      }

      onUpdated(changes);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update customer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="rounded-lg border border-[#003566] bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00264d]"
      >
        <span className="inline-flex items-center gap-2">
          <Pencil size={15} />
          Edit
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setIsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-customer-title"
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2
                  id="edit-customer-title"
                  className="text-lg font-bold text-[#003566]"
                >
                  Edit customer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the customer&apos;s contact information.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close edit customer dialog"
                disabled={saving}
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </span>
                <input
                  name="name"
                  defaultValue={getText(initialData, "name")}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1762AE] focus:ring-2 focus:ring-[#1762AE]/10"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  defaultValue={getText(initialData, "email")}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1762AE] focus:ring-2 focus:ring-[#1762AE]/10"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={getText(initialData, "phone")}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1762AE] focus:ring-2 focus:ring-[#1762AE]/10"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#003566] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00264d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
