"use client";

import { useState } from "react";

import { Button, Modal } from "@heroui/react";
import { CircleX } from "lucide-react";

const DeleteCustomer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReject = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
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
          {/* placement="center" এবং max-w-md (বা max-w-lg) ব্যবহার করা হয়েছে */}
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
                  Reject Customer Application?
                </Modal.Heading>
              </Modal.Header>

              {/* Body */}
              <Modal.Body className="relative px-6 text-center">
                <p className="text-sm leading-6 text-muted">
                  Are you sure you want to reject this customer account
                  creation application?
                </p>

                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                  <p className="text-xs leading-5 text-red-700 dark:text-red-300">
                    Once rejected, this application will no longer be
                    available to the customer.
                  </p>
                </div>
              </Modal.Body>

              {/* Footer */}
              <Modal.Footer className="relative flex w-full gap-3 px-6 pb-6 pt-5">
                <Button
                  variant="secondary"
                  onPress={() => setIsOpen(false)}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  onPress={handleReject}
                  className="flex-1 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700"
                >
                  Rejected
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