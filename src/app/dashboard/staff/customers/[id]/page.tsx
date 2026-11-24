
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  Mail,
  ShieldCheck,
  MapPin,
  Loader2,
  BriefcaseBusiness,
  Wallet,
  LockKeyhole,
  Database,
  Info,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EditCutomer from "@/components/Layout/dashboard/staff/customer/EditCutomer";

import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";

type CustomerData = Record<string, unknown>;

interface FieldItem {
  key: string;
  label: string;
  value: unknown;
}

interface Section {
  title: string;
  icon: React.ElementType;
  fields: FieldItem[];
}

const HIDDEN_KEYS = [
  "password",
  "passwordhash",
  "accesstoken",
  "refreshtoken",
  "token",
  "secret",
  "clientsecret",
  "apikey",
  "privatekey",
  "otp",
  "verificationtoken",
  "sessiontoken",
  "credentials",
];

const SECTION_CONFIG = [
  {
    title: "Personal Information",
    icon: UserRound,
    keywords: [
      "name",
      "email",
      "phone",
      "mobile",
      "gender",
      "dob",
      "birth",
      "age",
      "image",
      "avatar",
      "profile",
    ],
  },
  {
    title: "Address Information",
    icon: MapPin,
    keywords: [
      "address",
      "city",
      "country",
      "state",
      "district",
      "postal",
      "zip",
      "location",
    ],
  },
  {
    title: "Professional Information",
    icon: BriefcaseBusiness,
    keywords: [
      "occupation",
      "profession",
      "job",
      "company",
      "organization",
      "designation",
      "employee",
      "business",
      "work",
      "status",
    ],
  },
  {
    title: "Financial Information",
    icon: Wallet,
    keywords: [
      "balance",
      "income",
      "salary",
      "currency",
      "financial",
      "amount",
      "limit",
      "fee",
      "money",
    ],
  },
  {
    title: "Security Information",
    icon: LockKeyhole,
    keywords: [
      "security",
      "login",
      "lastlogin",
      "twofactor",
      "authentication",
      "verification",
      "blocked",
    ],
  },
];

function formatLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isHiddenKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[_-]/g, "");

  return HIDDEN_KEYS.some((hidden) =>
    normalized.includes(hidden)
  );
}

function isImageKey(key: string): boolean {
  return /^(image|avatar|profileimage|profilephoto|photo|picture)$/i.test(
    key.replace(/[_-]/g, "")
  );
}

function getImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const object = value as Record<string, unknown>;

    if (typeof object.url === "string") return object.url;
    if (typeof object.secure_url === "string") {
      return object.secure_url;
    }
  }

  return null;
}

function formatValue(value: unknown, key = ""): string {
  if (value === null || value === undefined || value === "") {
    return "Not Provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    if (/date|createdat|updatedat|lastlogin|timestamp/i.test(key)) {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "Not Provided";

    return value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSON.stringify(item);
        }

        return String(item);
      })
      .join(", ");
  }

  if (typeof value === "object") {
    const object = value as Record<string, unknown>;

    if (typeof object.$oid === "string") {
      return object.$oid;
    }

    if (object.$date) {
      return formatValue(object.$date, "date");
    }

    return JSON.stringify(object);
  }

  return String(value);
}

function flattenData(
  data: CustomerData,
  prefix = ""
): FieldItem[] {
  const result: FieldItem[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (isHiddenKey(key)) return;
    if (isImageKey(key)) return;

    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !("$oid" in value) &&
      !("$date" in value)
    ) {
      const nested = flattenData(
        value as CustomerData,
        fullKey
      );

      result.push(...nested);
      return;
    }

    result.push({
      key: fullKey,
      label: formatLabel(fullKey),
      value,
    });
  });

  return result;
}

function getSectionIndex(key: string): number {
  const normalized = key
    .split(".")
    .pop()!
    .toLowerCase()
    .replace(/[_-]/g, "");

  for (let i = 0; i < SECTION_CONFIG.length; i++) {
    const config = SECTION_CONFIG[i];

    if (
      config.keywords.some((keyword) =>
        normalized === keyword ||
        normalized.startsWith(keyword)
      )
    ) {
      return i;
    }
  }

  return -1;
}

function buildSections(customer: CustomerData): Section[] {
  const fields = flattenData(customer);

  const grouped: Section[] = SECTION_CONFIG.map(
    (section) => ({
      title: section.title,
      icon: section.icon,
      fields: [],
    })
  );

  const additional: FieldItem[] = [];

  fields.forEach((field) => {
    const index = getSectionIndex(field.key);

    if (index >= 0) {
      grouped[index].fields.push(field);
    } else {
      additional.push(field);
    }
  });

  const sections = grouped.filter(
    (section) => section.fields.length > 0
  );

  if (additional.length > 0) {
    sections.push({
      title: "Additional Database Information",
      icon: Database,
      fields: additional,
    });
  }

  return sections;
}

function getProfileImage(customer: CustomerData): string | null {
  for (const [key, value] of Object.entries(customer)) {
    if (isImageKey(key)) {
      return getImageUrl(value);
    }
  }

  return null;
}

function InfoField({ field }: { field: FieldItem }) {
  const value = formatValue(field.value, field.key);

  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
        {field.label}
      </label>

      <div className="flex min-h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors dark:border-gray-800 dark:bg-gray-900">
        <span className="break-all text-sm font-medium text-gray-800 dark:text-gray-200">
          {value}
        </span>
      </div>
    </div>
  );
}

function CustomerDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  // Logged-in staff information
  const loggedInUser = useAppSelector(selectUser);

  const [customer, setCustomer] =
    useState<CustomerData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customer
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customer details.");
        }

        const result = await response.json();

        const customerData =
          result.data || result.user || result;

        if (
          !customerData ||
          typeof customerData !== "object" ||
          Array.isArray(customerData)
        ) {
          throw new Error("Customer information not found.");
        }

        if (isMounted) {
          setCustomer(customerData as CustomerData);
        }
      } catch (err) {
        console.error("Customer fetch error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCustomer();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          <p className="text-sm text-gray-500">
            Loading customer information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-950">
          <Info className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Not Found
        </h2>

        <p className="text-center text-sm text-gray-500">
          {error || "Customer information is unavailable."}
        </p>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  const sections = buildSections(customer);
  const profileImage = getProfileImage(customer);

  const customerName =
    typeof customer.name === "string"
      ? customer.name
      : "Unknown Customer";

  const customerEmail =
    typeof customer.email === "string"
      ? customer.email
      : "No email available";

  const customerStatus =
    typeof customer.status === "string"
      ? customer.status
      : "Unknown";

  // Case-insensitive active status check
  const isActive =
    customerStatus.trim().toLowerCase() === "active";

  const customerId = String(customer._id || id);
  const staffEmail = String(loggedInUser?.email || "");

  return (
    <div className="mt-8 min-h-screen bg-gray-50 px-3 py-5 dark:bg-gray-950 lg:mt-0 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">

        {/* Main Customer Information Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">

          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#003566] p-5">

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Customer Details
                </h1>

                <p className="text-xs text-gray-300">
                  View complete customer information
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2">

              {/* Edit button always visible */}
              <EditCutomer customerId={id} />

              {/* Approve and Reject only when NOT active */}
              {!isActive && (
                <>
                 

                  <Link
                    href={`/dashboard/staff/customers/${id}/reject`}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <XCircle size={16} />
                    Reject
                  </Link>
                  <Link
                    href={{
                      pathname: `/dashboard/staff/customers/${id}/approved`,
                      query: {
                        customerId,
                        customerEmail,
                        staffEmail,
                      },
                    }}
                    className="rounded-lg border border-white bg-[#003566] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#00264d]"
                  >
                    Approve
                  </Link>
                </>
              )}

            </div>
          </div>

          {/* Customer Profile Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white px-5 py-5 dark:border-gray-800 dark:from-cyan-950/30 dark:to-gray-950 sm:flex-row sm:items-center sm:px-6">

            <div className="flex min-w-0 flex-wrap items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">

                {profileImage ? (
                  <Image
                    width={100}
                    height={100}
                    src={profileImage}
                    alt={customerName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-8 w-8 text-cyan-600" />
                )}

              </div>

              <div className="min-w-0 flex-1">

                <h2 className="break-words text-lg font-bold text-gray-900 dark:text-white">
                  {customerName}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail size={14} />
                  <span className="break-all">
                    {customerEmail}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">

                  <span className="rounded-md bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
                    {String(customer.role || "Customer")}
                  </span>

                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    ID: {customerId}
                  </span>

                </div>

              </div>
            </div>

            {/* Customer Status */}
            <div
              className={`inline-flex w-fit shrink-0 self-start items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:self-center ${isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${isActive ? "bg-green-500" : "bg-gray-500"
                  }`}
              />
              {customerStatus}
            </div>

          </div>

          {/* All Dynamic Information */}
          <div className="space-y-6 p-4 sm:p-6">

            {sections.map((section, index) => {
              const SectionIcon = section.icon;

              return (
                <section key={section.title}>

                  <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
                      <SectionIcon size={16} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                        {String(index + 1).padStart(2, "0")}.{" "}
                        {section.title}
                      </h3>

                      <p className="text-[11px] text-gray-400">
                        {section.fields.length} information fields
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">

                    {section.fields.map((field) => (
                      <InfoField
                        key={field.key}
                        field={field}
                      />
                    ))}

                  </div>

                </section>
              );
            })}

            {sections.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-700">
                <Database className="mx-auto mb-2 h-8 w-8 text-gray-400" />

                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  No customer information available
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 pb-3 text-xs text-gray-400">
          <ShieldCheck size={14} />
          Secure Customer Information Management
        </div>

      </div>
    </div>
  );
}

export default function CustomerDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      }
    >
      <CustomerDetailsContent />
    </Suspense>
  );
}
