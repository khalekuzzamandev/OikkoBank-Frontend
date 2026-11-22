"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Option = { value: string; label: string };

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: Option[];
  full?: boolean;
};

type Section = { title: string; fields: Field[] };

const sections: Section[] = [
  {
    title: "Personal Information",
    fields: [
      { name: "name", label: "Full Name", placeholder: "Your full name" },
      { name: "fatherName", label: "Father's Name", placeholder: "Father's name" },
      { name: "motherName", label: "Mother's Name", placeholder: "Mother's name" },
      { name: "dob", label: "Date of Birth", type: "date" },
      {
        name: "gender",
        label: "Gender",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "maritalStatus",
        label: "Marital Status",
        options: [
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "divorced", label: "Divorced" },
          { value: "widowed", label: "Widowed" },
        ],
      },
      { name: "nid", label: "NID Number", placeholder: "National ID number" },
      { name: "occupation", label: "Occupation", placeholder: "Your occupation" },
      {
        name: "religion",
        label: "Religion",
        options: [
          { value: "islam", label: "Islam" },
          { value: "hinduism", label: "Hinduism" },
          { value: "buddhism", label: "Buddhism" },
          { value: "christianity", label: "Christianity" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
      { name: "phone", label: "Mobile Number", placeholder: "01XXXXXXXXX" },
      { name: "altPhone", label: "Alternative Mobile Number", placeholder: "01XXXXXXXXX" },
    ],
  },
  {
    title: "Present Address",
    fields: [
      {
        name: "division",
        label: "Division",
        options: [
          { value: "Dhaka", label: "Dhaka" },
          { value: "Chattogram", label: "Chattogram" },
          { value: "Rajshahi", label: "Rajshahi" },
          { value: "Khulna", label: "Khulna" },
          { value: "Barishal", label: "Barishal" },
          { value: "Sylhet", label: "Sylhet" },
          { value: "Rangpur", label: "Rangpur" },
          { value: "Mymensingh", label: "Mymensingh" },
        ],
      },
      { name: "district", label: "District", placeholder: "District" },
      { name: "thana", label: "Thana / Upazila", placeholder: "Thana / Upazila" },
      { name: "postOffice", label: "Post Office", placeholder: "Post office" },
      { name: "postCode", label: "Post Code", placeholder: "Post code" },
      { name: "village", label: "Village / Area", placeholder: "Village / Area" },
      {
        name: "address",
        label: "House / Road / Detailed Address",
        placeholder: "House number, road, block, etc.",
        full: true,
      },
    ],
  },
  {
    title: "Account & Security",
    fields: [
      {
        name: "accountType",
        label: "Account Type",
        options: [
          { value: "savings", label: "Savings Account" },
          { value: "current", label: "Current Account" },
          { value: "business", label: "Business Account" },
        ],
      },
      { name: "nomineeName", label: "Nominee's Name", placeholder: "Nominee's name" },
      { name: "nomineeRelation", label: "Relation with Nominee", placeholder: "e.g. Spouse, Brother" },
      { name: "nomineePhone", label: "Nominee's Mobile Number", placeholder: "01XXXXXXXXX" },
      { name: "nomineeNid", label: "Nominee's NID Number", placeholder: "Nominee's national ID number" },
      { name: "photo", label: "Photo", type: "file" },
      { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Re-enter your password",
      },
    ],
  },
];

const REQUIRED_MSG = "This field is required";

const validate = (data: Record<string, FormDataEntryValue>) => {
  const errors: Record<string, string> = {};
  const get = (key: string) => {
    const v = data[key];
    return typeof v === "string" ? v.trim() : "";
  };

  sections.forEach((section) =>
    section.fields.forEach((f) => {
      if (f.type === "file") {
        const file = data[f.name];
        if (!(file instanceof File) || file.size === 0) errors[f.name] = REQUIRED_MSG;
        else if (!file.type.startsWith("image/")) errors[f.name] = "Please upload an image file only";
        return;
      }
      if (!get(f.name)) errors[f.name] = REQUIRED_MSG;
    })
  );

  const phoneRe = /^01[3-9]\d{8}$/;
  const nidRe = /^(\d{10}|\d{13}|\d{17})$/;

  if (!errors.email && !/^\S+@\S+\.\S+$/.test(get("email"))) errors.email = "Enter a valid email address";
  if (!errors.phone && !phoneRe.test(get("phone"))) errors.phone = "Enter a valid mobile number";
  if (!errors.altPhone && !phoneRe.test(get("altPhone"))) errors.altPhone = "Enter a valid mobile number";
  if (!errors.nomineePhone && !phoneRe.test(get("nomineePhone")))
    errors.nomineePhone = "Enter a valid mobile number";
  if (!errors.nid && !nidRe.test(get("nid"))) errors.nid = "NID must be 10, 13 or 17 digits";
  if (!errors.nomineeNid && !nidRe.test(get("nomineeNid")))
    errors.nomineeNid = "NID must be 10, 13 or 17 digits";
  if (!errors.postCode && !/^\d{4}$/.test(get("postCode")))
    errors.postCode = "Post code must be 4 digits";
  if (!errors.password && get("password").length < 8)
    errors.password = "Password must be at least 8 characters";
  if (!errors.confirmPassword && get("confirmPassword") !== get("password"))
    errors.confirmPassword = "Passwords do not match";

  return errors;
};

const baseInput =
  "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:ring-2";
const normalInput = "border-gray-300 focus:border-[#1762AE] focus:ring-[#1762AE]/20";
const errorInput = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const fileClass =
  "file:mr-3 file:rounded file:border-0 file:bg-[#003566] file:px-3 file:py-1 file:text-xs file:text-white";

const labelClass = "mb-1 block text-xs font-medium text-gray-700";
const sectionClass = "mb-3 border-b border-gray-200 pb-1 text-sm font-semibold text-[#003566]";

const RegisterPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.name && errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[target.name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = validate(data);
    setErrors(result);

    if (Object.keys(result).length > 0) {
      const first = Object.keys(result)[0];
      document.getElementById(first)?.focus();
      return;
    }

    console.log(data);
  };

  const renderField = (f: Field) => {
    const inputClassName = `${baseInput} ${errors[f.name] ? errorInput : normalInput}`;

    return (
      <div key={f.name} className={f.full ? "sm:col-span-2 lg:col-span-3" : ""}>
        <label htmlFor={f.name} className={labelClass}>
          {f.label} <span className="text-red-500">*</span>
        </label>

        {f.options ? (
          <select
            id={f.name}
            name={f.name}
            defaultValue=""
            className={inputClassName}
          >
            <option value="" disabled>
              Select
            </option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={f.name}
            name={f.name}
            type={f.type || "text"}
            placeholder={f.placeholder}
            accept={f.type === "file" ? "image/*" : undefined}
            className={`${inputClassName} ${f.type === "file" ? fileClass : ""}`}
          />
        )}

        {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#003566] px-4 py-8">
      <div className="w-full max-w-5xl rounded-md bg-white p-5 shadow-lg sm:p-7">
        <div className="mb-5 flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/images/oikko bank logo.PNG"
              alt="Oikko Bank"
              width={140}
              height={50}
              priority
              className="h-auto w-36 object-contain"
            />
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-[#003566]">New Account Application</h1>
          <p className="mt-1 text-sm text-gray-500">
            After you submit, a bank staff member will verify your information and activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} onChange={handleChange} noValidate className="space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className={sectionClass}>{section.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.fields.map(renderField)}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#1762AE] hover:underline">
                Log in
              </Link>
            </p>
            <button
              type="submit"
              className="w-full rounded-md bg-[#003566] px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1762AE] sm:w-auto"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;