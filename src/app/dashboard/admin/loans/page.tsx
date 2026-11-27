
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Eye,
//   CheckCircle2,
//   Clock,
//   Loader2,
//   RefreshCw,
//   X,
//   UserRound,
//   Mail,
//   Banknote,
//   CalendarDays,
//   FileText,
//   AlertCircle,
//   ShieldCheck,
// } from "lucide-react";

// import {
//   getAllLoans,
//   updateLoan,
// } from "@/components/lib/Apis/loan/loan";

// interface LoanApplication {
//   _id?: string;
//   id?: string;
//   userId?: string;
//   customerName?: string;
//   name?: string;
//   email?: string;
//   loanType?: string;
//   loanAmount?: number | string;
//   amount?: number | string;
//   applicationStatus?: string;
//   status?: string;
//   purpose?: string;
//   duration?: number | string;
//   interestRate?: number | string;
//   createdAt?: string;
//   updatedAt?: string;
//   [key: string]: unknown;
// }

// const AllLoanManagment = () => {
//   const [loans, setLoans] = useState<LoanApplication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [processingId, setProcessingId] = useState<string | null>(null);
//   const [selectedLoan, setSelectedLoan] =
//     useState<LoanApplication | null>(null);
//   const [error, setError] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const getLoanId = (loan: LoanApplication) =>
//     String(loan._id || loan.id || "");

//   const getLoanStatus = (loan: LoanApplication) =>
//     String(loan.applicationStatus || loan.status || "").toLowerCase();

//   const getCustomerName = (loan: LoanApplication) =>
//     loan.customerName || loan.name || "Unknown Customer";

//   const getLoanAmount = (loan: LoanApplication) =>
//     Number(loan.loanAmount || loan.amount || 0);

//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getAllLoans<unknown>();

//         let records: LoanApplication[] = [];

//         if (Array.isArray(response)) {
//           records = response as LoanApplication[];
//         } else if (
//           response &&
//           typeof response === "object"
//         ) {
//           const data = response as Record<string, unknown>;

//           if (Array.isArray(data.data)) {
//             records = data.data as LoanApplication[];
//           } else if (Array.isArray(data.loans)) {
//             records = data.loans as LoanApplication[];
//           } else if (Array.isArray(data.result)) {
//             records = data.result as LoanApplication[];
//           }
//         }

//         setLoans(
//           records.filter((loan) => {
//             const status = getLoanStatus(loan);
//             return status === "reviewing" || status === "under review";
//           })
//         );
//       } catch (err) {
//         console.error("Failed to fetch loans:", err);
//         setError("Failed to load loan applications.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLoans();
//   }, [refreshKey]);

//   const filteredLoans = useMemo(() => {
//     const search = searchTerm.toLowerCase().trim();

//     return loans.filter((loan) => {
//       return (
//         getCustomerName(loan).toLowerCase().includes(search) ||
//         String(loan.email || "").toLowerCase().includes(search) ||
//         String(loan.loanType || "").toLowerCase().includes(search) ||
//         getLoanId(loan).toLowerCase().includes(search)
//       );
//     });
//   }, [loans, searchTerm]);

//   const handleApprove = async (loan: LoanApplication) => {
//     const id = getLoanId(loan);

//     if (!id) {
//       setError("Loan ID not found.");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to approve this loan?"
//     );

//     if (!confirmed) return;

//     try {
//       setProcessingId(id);
//       setError("");

//       await updateLoan(id, {
//         applicationStatus: "Approved",
//       });

//       setLoans((previous) =>
//         previous.filter((item) => getLoanId(item) !== id)
//       );

//       if (selectedLoan && getLoanId(selectedLoan) === id) {
//         setSelectedLoan(null);
//       }
//     } catch (err) {
//       console.error("Loan approval failed:", err);
//       setError("Failed to approve this loan. Please try again.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const formatMoney = (amount: number) =>
//     new Intl.NumberFormat("en-BD", {
//       style: "currency",
//       currency: "BDT",
//       maximumFractionDigits: 0,
//     }).format(amount);

//   const formatDate = (date?: string) => {
//     if (!date) return "N/A";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) return "N/A";

//     return parsedDate.toLocaleDateString("en-BD", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl space-y-6">

//         {/* Header */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               <div className="rounded-lg bg-[#003566] p-2 text-white">
//                 <Banknote size={20} />
//               </div>
//               <span className="text-sm font-semibold text-[#003566]">
//                 OikkoBank Admin
//               </span>
//             </div>

//             <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//               Loan Management
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Review and approve customer loan applications.
//             </p>
//           </div>

//           <button
//             onClick={() => setRefreshKey((prev) => prev + 1)}
//             disabled={loading}
//             className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
//           >
//             <RefreshCw
//               size={16}
//               className={loading ? "animate-spin" : ""}
//             />
//             Refresh
//           </button>
//         </div>

//         {/* Summary */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-500">
//                   Reviewing Applications
//                 </p>
//                 <h2 className="mt-2 text-3xl font-bold text-slate-900">
//                   {loans.length}
//                 </h2>
//               </div>

//               <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
//                 <Clock size={25} />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-slate-500">
//                   Total Reviewing Amount
//                 </p>
//                 <h2 className="mt-2 text-2xl font-bold text-slate-900">
//                   {formatMoney(
//                     loans.reduce(
//                       (total, loan) => total + getLoanAmount(loan),
//                       0
//                     )
//                   )}
//                 </h2>
//               </div>

//               <div className="rounded-xl bg-blue-50 p-3 text-[#003566]">
//                 <Banknote size={25} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="relative">
//             <Search
//               size={19}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by customer name, email, loan type or ID..."
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#003566] focus:bg-white focus:ring-2 focus:ring-[#003566]/10"
//             />
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {/* Table */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 Reviewing Loan Applications
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Applications waiting for admin approval.
//               </p>
//             </div>

//             <span className="flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
//               <span className="h-2 w-2 rounded-full bg-amber-500" />
//               {filteredLoans.length} Applications
//             </span>
//           </div>

//           {loading ? (
//             <div className="flex min-h-64 items-center justify-center">
//               <div className="flex flex-col items-center gap-3">
//                 <Loader2
//                   size={32}
//                   className="animate-spin text-[#003566]"
//                 />
//                 <p className="text-sm text-slate-500">
//                   Loading loan applications...
//                 </p>
//               </div>
//             </div>
//           ) : filteredLoans.length === 0 ? (
//             <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
//               <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
//                 <FileText size={30} />
//               </div>

//               <h3 className="text-lg font-bold text-slate-800">
//                 No Reviewing Applications
//               </h3>

//               <p className="mt-1 max-w-sm text-sm text-slate-500">
//                 There are currently no loan applications waiting for admin approval.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[850px] text-left">
//                 <thead className="bg-slate-50">
//                   <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                     <th className="px-5 py-4">Customer</th>
//                     <th className="px-5 py-4">Loan Type</th>
//                     <th className="px-5 py-4">Loan Amount</th>
//                     <th className="px-5 py-4">Applied Date</th>
//                     <th className="px-5 py-4">Status</th>
//                     <th className="px-5 py-4 text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {filteredLoans.map((loan) => {
//                     const id = getLoanId(loan);

//                     return (
//                       <tr
//                         key={id}
//                         className="transition hover:bg-slate-50"
//                       >
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#003566]">
//                               <UserRound size={19} />
//                             </div>

//                             <div>
//                               <p className="font-semibold text-slate-800">
//                                 {getCustomerName(loan)}
//                               </p>
//                               <p className="text-xs text-slate-500">
//                                 {loan.email || "No email"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-5 py-4 text-sm font-medium text-slate-700">
//                           {loan.loanType || "Personal Loan"}
//                         </td>

//                         <td className="px-5 py-4 text-sm font-bold text-slate-800">
//                           {formatMoney(getLoanAmount(loan))}
//                         </td>

//                         <td className="px-5 py-4 text-sm text-slate-600">
//                           {formatDate(loan.createdAt)}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
//                             <Clock size={13} />
//                             Reviewing
//                           </span>
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-center gap-2">
//                             <button
//                               onClick={() => setSelectedLoan(loan)}
//                               className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#003566] transition hover:bg-blue-100"
//                             >
//                               <Eye size={15} />
//                               Details
//                             </button>

//                             <button
//                               onClick={() => handleApprove(loan)}
//                               disabled={processingId === id}
//                               className="flex items-center gap-1.5 rounded-lg bg-[#003566] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#004080] disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               {processingId === id ? (
//                                 <Loader2
//                                   size={15}
//                                   className="animate-spin"
//                                 />
//                               ) : (
//                                 <CheckCircle2 size={15} />
//                               )}
//                               Approve
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Details Modal */}
//       {selectedLoan && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
//           onClick={() => setSelectedLoan(null)}
//         >
//           <div
//             className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Loan Details
//                 </h2>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Review customer loan information
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedLoan(null)}
//                 className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-5 p-5">
//               <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
//                 <div className="rounded-full bg-white p-3 text-[#003566]">
//                   <UserRound size={24} />
//                 </div>

//                 <div>
//                   <h3 className="font-bold text-slate-900">
//                     {getCustomerName(selectedLoan)}
//                   </h3>
//                   <p className="text-sm text-slate-500">
//                     {selectedLoan.email || "No email available"}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div className="rounded-xl border border-slate-200 p-4">
//                   <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
//                     <Banknote size={15} />
//                     Loan Amount
//                   </p>
//                   <h3 className="text-lg font-bold text-[#003566]">
//                     {formatMoney(getLoanAmount(selectedLoan))}
//                   </h3>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 p-4">
//                   <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
//                     <FileText size={15} />
//                     Loan Type
//                   </p>
//                   <h3 className="font-bold text-slate-800">
//                     {selectedLoan.loanType || "N/A"}
//                   </h3>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 p-4">
//                   <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
//                     <CalendarDays size={15} />
//                     Applied Date
//                   </p>
//                   <h3 className="font-bold text-slate-800">
//                     {formatDate(selectedLoan.createdAt)}
//                   </h3>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 p-4">
//                   <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
//                     <ShieldCheck size={15} />
//                     Application Status
//                   </p>
//                   <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
//                     Reviewing
//                   </span>
//                 </div>
//               </div>

//               <div className="rounded-xl border border-slate-200 p-4">
//                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                   Loan Purpose
//                 </p>
//                 <p className="text-sm leading-6 text-slate-700">
//                   {selectedLoan.purpose || "No purpose provided."}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div className="rounded-xl bg-slate-50 p-4">
//                   <p className="text-xs text-slate-500">Duration</p>
//                   <p className="mt-1 font-semibold text-slate-800">
//                     {selectedLoan.duration
//                       ? `${selectedLoan.duration} Months`
//                       : "N/A"}
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-50 p-4">
//                   <p className="text-xs text-slate-500">Interest Rate</p>
//                   <p className="mt-1 font-semibold text-slate-800">
//                     {selectedLoan.interestRate
//                       ? `${selectedLoan.interestRate}%`
//                       : "N/A"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
//                 <button
//                   onClick={() => setSelectedLoan(null)}
//                   className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                 >
//                   Close
//                 </button>

//                 <button
//                   onClick={() => handleApprove(selectedLoan)}
//                   disabled={
//                     processingId === getLoanId(selectedLoan)
//                   }
//                   className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003566] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004080] disabled:opacity-50"
//                 >
//                   {processingId === getLoanId(selectedLoan) ? (
//                     <Loader2 size={17} className="animate-spin" />
//                   ) : (
//                     <CheckCircle2 size={17} />
//                   )}
//                   Approve Loan
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllLoanManagment;
