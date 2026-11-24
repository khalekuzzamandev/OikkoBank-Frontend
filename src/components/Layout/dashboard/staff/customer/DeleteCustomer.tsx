
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Modal } from "@heroui/react";
import { CircleX, Loader2 } from "lucide-react";

import { deleteUser } from "@/components/lib/Apis/users/users";

interface DeleteCustomerProps {
  customerId: string;
}

const DeleteCustomer = ({ customerId }: DeleteCustomerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleDelete = async () => {
    if (!customerId) {
      setError("Customer ID not found!");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteUser(customerId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsOpen(false);

      alert("Customer deleted successfully!");

      router.push("/dashboard/staff/customers");
      router.refresh();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete customer"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsOpen(open);
            if (!open) setError("");
          }
        }}
      >
        <Button
          variant="danger"
          onPress={() => setIsOpen(true)}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200 dark:border-red-900 dark:hover:bg-red-950"
        >
          Delete
        </Button>

        <Modal.Backdrop
          variant="blur"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/65"
        >
          <Modal.Container
            placement="center"
            className="mx-auto flex w-full max-w-md items-center justify-center"
          >
            <Modal.Dialog
              className="relative w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-2xl dark:border-border/90 dark:bg-surface"
            >
              {/* Top Decoration */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-500/10 to-transparent"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent"
              />

              <Modal.CloseTrigger />

              {/* Header */}
              <Modal.Header className="relative flex flex-col items-center pt-7 text-center">
                <Modal.Icon className="mb-3 flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <CircleX className="size-7" />
                </Modal.Icon>

                <Modal.Heading className="text-lg font-bold">
                  Delete Customer?
                </Modal.Heading>
              </Modal.Header>

              {/* Body */}
              <Modal.Body className="relative px-5 text-center sm:px-6">
                <p className="text-sm leading-6 text-muted">
                  Are you sure you want to delete this customer account?
                </p>

                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                  <p className="text-xs leading-5 text-red-700 dark:text-red-300">
                    This action cannot be undone. The customer account
                    will be permanently removed from the database.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}
              </Modal.Body>

              {/* Footer */}
              <Modal.Footer className="relative flex w-full gap-3 px-5 pb-5 pt-5">
                <Button
                  variant="secondary"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isDeleting}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  onPress={handleDelete}
                  isDisabled={isDeleting}
                  className="flex-1 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default DeleteCustomer;
