
"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "@heroui/react";
import {
  Edit,
  Loader2,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { editUser, getUserById } from "@/components/lib/Apis/users/users";
import Image from "next/image";

interface EditCustomerProps {
  customerId: string;
}

interface CustomerForm {
  name: string;
  email: string;
  image: string;
  status: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
}

const initialForm: CustomerForm = {
  name: "",
  email: "",
  image: "",
  status: "Active",
  fatherName: "",
  motherName: "",
  dob: "",
  gender: "",
};

const PRIMARY = "#003566";

const EditCutomer = ({ customerId }: EditCustomerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const result = await getUserById(customerId);
        const customer = result?.data || result?.user || result;

        if (!customer || (!customer._id && !customer.id)) {
          throw new Error("Customer not found");
        }

        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          image:
            customer.image ||
            customer.profileImage ||
            customer.avatar ||
            "",
          status: customer.status || "pending",
          fatherName: customer.fatherName || "",
          motherName: customer.motherName || "",
          dob: customer.dob
            ? new Date(customer.dob).toISOString().split("T")[0]
            : "",
          gender: customer.gender || "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [isOpen, customerId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      const result = await editUser(customerId, { ...formData });

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess("Customer updated successfully!");

      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-[46px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal hover:border-[#003566]/50 focus:border-[#003566] focus:ring-[3px] focus:ring-[#003566]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:hover:border-[#003566]";

  const labelClass =
    "mb-2 block text-[13px] font-semibold text-gray-600 dark:text-gray-300";

  return (
    <Modal>
      <Button
        variant="secondary"
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Edit size={16} />
        Edit
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className="bg-black/50 backdrop-blur-md"
        variant="blur"
      >
        <Modal.Container className="w-[96vw] max-w-[850px] px-2 sm:px-4">
          <Modal.Dialog className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">

            {/* Header */}
            <Modal.Header className="relative flex items-center gap-4 border-b border-gray-200 px-5 py-5 sm:px-7 dark:border-gray-800">

              <Modal.Icon
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                <UserRound size={22} />
              </Modal.Icon>

              <div className="min-w-0 flex-1">
                <Modal.Heading className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Customer
                </Modal.Heading>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Update customer information and personal details.
                </p>
              </div>

              <Modal.CloseTrigger className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <X size={17} />
              </Modal.CloseTrigger>
            </Modal.Header>

            {/* Form Body */}
            <Modal.Body className="max-h-[65vh] overflow-y-auto px-5 py-6 sm:px-7">

              {loading ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <Loader2
                    className="h-9 w-9 animate-spin"
                    style={{ color: PRIMARY }}
                  />
                  <p className="text-sm text-gray-500">
                    Loading customer information...
                  </p>
                </div>
              ) : (
                <div className="space-y-5">

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                      {success}
                    </div>
                  )}

                  {/* Notice */}
                  <div
                    className="rounded-lg border px-4 py-3 text-sm font-medium"
                    style={{
                      backgroundColor: "rgba(0,53,102,0.05)",
                      borderColor: "rgba(0,53,102,0.15)",
                      color: PRIMARY,
                    }}
                  >
                    Staff can update the customer profile information listed below.
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

                    {/* Name */}
                    <div>
                      <label className={labelClass}>Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter customer name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter customer email"
                      />
                    </div>

                    {/* Image */}
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Profile Image URL</label>
                      <input
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://example.com/image.jpg"
                      />

                      {formData.image && (
                        <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                          <Image
                            width={100}
                            height={100}
                            src={formData.image}
                            alt="Customer preview"
                            className="h-16 w-16 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              Profile Preview
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Customer profile image
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className={labelClass}>Account Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClass}
                      >

                          <option value="pending">Pending</option>
                        <option value="active">Active</option>

                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className={labelClass}>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Father Name */}
                    <div>
                      <label className={labelClass}>Father Name</label>
                      <input
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter father name"
                      />
                    </div>

                    {/* Mother Name */}
                    <div>
                      <label className={labelClass}>Mother Name</label>
                      <input
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter mother name"
                      />
                    </div>

                    {/* DOB */}
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                  </div>
                </div>
              )}
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="flex flex-row items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-7 dark:border-gray-800">

              <Button
                variant="secondary"
                className="min-w-[110px] rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                onPress={() => setIsOpen(false)}
                isDisabled={saving}
              >
                Cancel
              </Button>

              <Button
                className="min-w-[155px] rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
                onPress={handleUpdate}
                isDisabled={
                  loading ||
                  saving ||
                  !formData.name.trim() ||
                  !formData.email.trim()
                }
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>

            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditCutomer;
