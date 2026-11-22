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
    title: "ব্যক্তিগত তথ্য",
    fields: [
      { name: "name", label: "পুরো নাম", placeholder: "আপনার পুরো নাম" },
      { name: "fatherName", label: "পিতার নাম", placeholder: "পিতার নাম" },
      { name: "motherName", label: "মাতার নাম", placeholder: "মাতার নাম" },
      { name: "dob", label: "জন্ম তারিখ", type: "date" },
      {
        name: "gender",
        label: "লিঙ্গ",
        options: [
          { value: "male", label: "পুরুষ" },
          { value: "female", label: "নারী" },
          { value: "other", label: "অন্যান্য" },
        ],
      },
      {
        name: "maritalStatus",
        label: "বৈবাহিক অবস্থা",
        options: [
          { value: "single", label: "অবিবাহিত" },
          { value: "married", label: "বিবাহিত" },
          { value: "divorced", label: "বিবাহবিচ্ছিন্ন" },
          { value: "widowed", label: "বিধবা/বিপত্নীক" },
        ],
      },
      { name: "nid", label: "NID নম্বর", placeholder: "জাতীয় পরিচয়পত্র নম্বর" },
      { name: "occupation", label: "পেশা", placeholder: "আপনার পেশা" },
      {
        name: "religion",
        label: "ধর্ম",
        options: [
          { value: "islam", label: "ইসলাম" },
          { value: "hinduism", label: "হিন্দু" },
          { value: "buddhism", label: "বৌদ্ধ" },
          { value: "christianity", label: "খ্রিস্টান" },
          { value: "other", label: "অন্যান্য" },
        ],
      },
    ],
  },
  {
    title: "যোগাযোগ",
    fields: [
      { name: "email", label: "ইমেইল", type: "email", placeholder: "you@example.com" },
      { name: "phone", label: "মোবাইল নম্বর", placeholder: "01XXXXXXXXX" },
      { name: "altPhone", label: "বিকল্প মোবাইল নম্বর", placeholder: "01XXXXXXXXX" },
    ],
  },
  {
    title: "বর্তমান ঠিকানা",
    fields: [
      {
        name: "division",
        label: "বিভাগ",
        options: [
          { value: "ঢাকা", label: "ঢাকা" },
          { value: "চট্টগ্রাম", label: "চট্টগ্রাম" },
          { value: "রাজশাহী", label: "রাজশাহী" },
          { value: "খুলনা", label: "খুলনা" },
          { value: "বরিশাল", label: "বরিশাল" },
          { value: "সিলেট", label: "সিলেট" },
          { value: "রংপুর", label: "রংপুর" },
          { value: "ময়মনসিংহ", label: "ময়মনসিংহ" },
        ],
      },
      { name: "district", label: "জেলা", placeholder: "জেলা" },
      { name: "thana", label: "থানা / উপজেলা", placeholder: "থানা / উপজেলা" },
      { name: "postOffice", label: "পোস্ট অফিস", placeholder: "পোস্ট অফিস" },
      { name: "postCode", label: "পোস্ট কোড", placeholder: "পোস্ট কোড" },
      { name: "village", label: "গ্রাম / এলাকা", placeholder: "গ্রাম / এলাকা" },
      {
        name: "address",
        label: "বাসা / রোড / বিস্তারিত ঠিকানা",
        placeholder: "বাসা নম্বর, রোড, ব্লক ইত্যাদি",
        full: true,
      },
    ],
  },
  {
    title: "অ্যাকাউন্ট ও নিরাপত্তা",
    fields: [
      {
        name: "accountType",
        label: "অ্যাকাউন্টের ধরন",
        options: [
          { value: "savings", label: "Savings Account" },
          { value: "current", label: "Current Account" },
          { value: "business", label: "Business Account" },
        ],
      },
      { name: "nomineeName", label: "নমিনির নাম", placeholder: "নমিনির নাম" },
      { name: "nomineeRelation", label: "নমিনির সাথে সম্পর্ক", placeholder: "যেমন: স্ত্রী, ভাই" },
      { name: "nomineePhone", label: "নমিনির মোবাইল নম্বর", placeholder: "01XXXXXXXXX" },
      { name: "nomineeNid", label: "নমিনির NID নম্বর", placeholder: "নমিনির জাতীয় পরিচয়পত্র নম্বর" },
      { name: "photo", label: "ছবি", type: "file" },
      { name: "password", label: "পাসওয়ার্ড", type: "password", placeholder: "কমপক্ষে ৮ অক্ষর" },
      {
        name: "confirmPassword",
        label: "পাসওয়ার্ড আবার দিন",
        type: "password",
        placeholder: "পাসওয়ার্ড আবার লিখুন",
      },
    ],
  },
];

const REQUIRED_MSG = "এই ফিল্ডটি আবশ্যক";

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
        else if (!file.type.startsWith("image/")) errors[f.name] = "শুধু ছবি আপলোড করুন";
        return;
      }
      if (!get(f.name)) errors[f.name] = REQUIRED_MSG;
    })
  );

  const phoneRe = /^01[3-9]\d{8}$/;
  const nidRe = /^(\d{10}|\d{13}|\d{17})$/;

  if (!errors.email && !/^\S+@\S+\.\S+$/.test(get("email"))) errors.email = "সঠিক ইমেইল দিন";
  if (!errors.phone && !phoneRe.test(get("phone"))) errors.phone = "সঠিক মোবাইল নম্বর দিন";
  if (!errors.altPhone && !phoneRe.test(get("altPhone"))) errors.altPhone = "সঠিক মোবাইল নম্বর দিন";
  if (!errors.nomineePhone && !phoneRe.test(get("nomineePhone")))
    errors.nomineePhone = "সঠিক মোবাইল নম্বর দিন";
  if (!errors.nid && !nidRe.test(get("nid"))) errors.nid = "NID ১০, ১৩ বা ১৭ ডিজিটের হতে হবে";
  if (!errors.nomineeNid && !nidRe.test(get("nomineeNid")))
    errors.nomineeNid = "NID ১০, ১৩ বা ১৭ ডিজিটের হতে হবে";
  if (!errors.postCode && !/^\d{4}$/.test(get("postCode")))
    errors.postCode = "পোস্ট কোড ৪ ডিজিটের হতে হবে";
  if (!errors.password && get("password").length < 8)
    errors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (!errors.confirmPassword && get("confirmPassword") !== get("password"))
    errors.confirmPassword = "পাসওয়ার্ড মিলছে না";

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
              নির্বাচন করুন
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
          <h1 className="mt-3 text-xl font-semibold text-[#003566]">নতুন অ্যাকাউন্টের আবেদন</h1>
          <p className="mt-1 text-sm text-gray-500">
            আবেদন জমা দিলে ব্যাংক স্টাফ আপনার তথ্য যাচাই করে অ্যাকাউন্ট চালু করবে।
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
              আগে থেকেই অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="font-semibold text-[#1762AE] hover:underline">
                লগইন করুন
              </Link>
            </p>
            <button
              type="submit"
              className="w-full rounded-md bg-[#003566] px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1762AE] sm:w-auto"
            >
              আবেদন জমা দিন
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;