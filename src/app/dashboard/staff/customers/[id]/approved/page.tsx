"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ApprovedContent = () => {
  const searchParams = useSearchParams();

  const customerId = searchParams.get("customerId");
  const customerEmail = searchParams.get("customerEmail");

  const staffId = searchParams.get("staffId");
  const staffEmail = searchParams.get("staffEmail");

  console.log("Customer ID:", customerId);
  console.log("Customer Email:", customerEmail);

  console.log("Staff ID:", staffId);
  console.log("Staff Email:", staffEmail);

  return (
    <div className="p-6">
      <h1>Customer Approval</h1>

      <h2>Customer Information</h2>
      <p>ID: {customerId}</p>
      <p>Email: {customerEmail}</p>

      <h2>Staff Information</h2>
      <p>ID: {staffId}</p>
      <p>Email: {staffEmail}</p>
    </div>
  );
};

const ApprovedPage = () => (
  <Suspense fallback={<div className="p-6">Loading approval details...</div>}>
    <ApprovedContent />
  </Suspense>
);

export default ApprovedPage;