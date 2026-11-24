
"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Users,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  Laptop,
  Wallet,
  Building2,
  Code2,
  Headphones,
  FileText,
  Send,
  CheckCircle2,
  Globe,
  Target,
  Coffee,
  ChevronRight,
  Mail,
} from "lucide-react";

const benefits = [
  {
    title: "Career Growth",
    description:
      "Develop your professional skills and grow through continuous learning opportunities.",
    icon: TrendingUp,
  },
  {
    title: "Collaborative Team",
    description:
      "Work with a supportive team that values ideas, creativity and teamwork.",
    icon: Users,
  },
  {
    title: "Learning Opportunities",
    description:
      "Improve your knowledge through training, mentorship and practical experience.",
    icon: GraduationCap,
  },
  {
    title: "Inclusive Workplace",
    description:
      "Be part of a respectful workplace where every contribution matters.",
    icon: HeartHandshake,
  },
];

const departments = [
  { name: "All Departments", icon: Building2 },
  { name: "Technology", icon: Code2 },
  { name: "Customer Support", icon: Headphones },
  { name: "Finance", icon: Wallet },
  { name: "Operations", icon: BriefcaseBusiness },
];

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Technology",
    type: "Full Time",
    location: "Dhaka, Bangladesh",
    experience: "1–2 Years",
    description:
      "Build responsive and user-friendly digital banking interfaces using modern frontend technologies.",
    icon: Code2,
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Technology",
    type: "Full Time",
    location: "Dhaka, Bangladesh",
    experience: "1–3 Years",
    description:
      "Develop secure APIs, banking services and scalable backend infrastructure.",
    icon: Laptop,
    tags: ["Node.js", "Express.js", "MongoDB", "REST API"],
  },
  {
    id: 3,
    title: "Customer Support Executive",
    department: "Customer Support",
    type: "Full Time",
    location: "Dhaka, Bangladesh",
    experience: "Fresher",
    description:
      "Assist customers with account-related questions and digital banking support.",
    icon: Headphones,
    tags: ["Communication", "Customer Service", "Problem Solving"],
  },
  {
    id: 4,
    title: "Financial Analyst",
    department: "Finance",
    type: "Full Time",
    location: "Dhaka, Bangladesh",
    experience: "2–3 Years",
    description:
      "Support financial reporting, analysis and internal financial operations.",
    icon: Wallet,
    tags: ["Financial Analysis", "Excel", "Reporting"],
  },
  {
    id: 5,
    title: "Banking Operations Associate",
    department: "Operations",
    type: "Full Time",
    location: "Dhaka, Bangladesh",
    experience: "1–2 Years",
    description:
      "Assist with operational processes, account documentation and service coordination.",
    icon: Building2,
    tags: ["Banking", "Documentation", "Operations"],
  },
  {
    id: 6,
    title: "Frontend Developer Intern",
    department: "Technology",
    type: "Internship",
    location: "Remote",
    experience: "Entry Level",
    description:
      "Learn and contribute to modern web application development with an experienced team.",
    icon: GraduationCap,
    tags: ["HTML", "CSS", "JavaScript", "React"],
  },
];

const recruitmentSteps = [
  {
    number: "01",
    title: "Apply Online",
    description:
      "Submit your application and share your professional background.",
  },
  {
    number: "02",
    title: "Application Review",
    description:
      "Our recruitment team reviews your skills and experience.",
  },
  {
    number: "03",
    title: "Interview",
    description:
      "Meet our team and demonstrate your knowledge and abilities.",
  },
  {
    number: "04",
    title: "Welcome Aboard",
    description:
      "Successful candidates receive the next steps to join the team.",
  },
];

const CareerPage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [jobType, setJobType] = useState("All Types");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchValue) ||
        job.department.toLowerCase().includes(searchValue) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchValue));

      const matchesDepartment =
        department === "All Departments" ||
        job.department === department;

      const matchesType =
        jobType === "All Types" || job.type === jobType;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [search, department, jobType]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#003566] px-4 py-16 text-white sm:px-6 lg:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100">
              <BriefcaseBusiness size={15} />
              CAREERS AT OIKKO BANK
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build Your Future.
              <br />
              <span className="text-blue-200">Grow With Us.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-blue-100 sm:text-base">
              Be part of a team shaping the future of digital banking.
              Explore opportunities to learn, innovate and make a meaningful
              impact with Oikko Bank.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#open-positions"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
              >
                Explore Opportunities
                <ArrowRight size={17} />
              </a>

              <a
                href="#why-join"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Why Join Us?
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-7 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-bold">Your</p>
                <p className="mt-1 text-xs text-blue-200">
                  Growth Matters
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">Our</p>
                <p className="mt-1 text-xs text-blue-200">
                  Team Comes First
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">Together</p>
                <p className="mt-1 text-xs text-blue-200">
                  We Innovate
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200">
                    Your Next Chapter
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Starts Here.
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Target size={29} />
                </div>
              </div>

              <div className="my-7 h-px bg-white/15" />

              <div className="space-y-5">
                {[
                  {
                    title: "Discover Your Potential",
                    text: "Find opportunities that match your strengths.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Learn and Develop",
                    text: "Build new skills through meaningful work.",
                    icon: GraduationCap,
                  },
                  {
                    title: "Make an Impact",
                    text: "Contribute to better digital banking services.",
                    icon: Globe,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-blue-100">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 -z-0 h-28 w-28 rounded-3xl border border-white/10 bg-white/5" />
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section
        id="why-join"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
            Why Oikko Bank
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            More Than Just a Workplace
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
            We believe great work starts with great people. Our goal is to
            create an environment where individuals can develop and contribute.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 font-bold">{benefit.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Positions */}
      <section
        id="open-positions"
        className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
                Career Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Explore Open Positions
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Find a role where your skills and passion can make a difference.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
              <BriefcaseBusiness size={15} />
              {filteredJobs.length} Positions Found
            </span>
          </div>

          {/* Search and Filters */}
          <div className="mb-7 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_220px_180px] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-950">
              <Search size={19} className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title or skills..."
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#003566] dark:border-slate-700 dark:bg-slate-950"
            >
              {departments.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#003566] dark:border-slate-700 dark:bg-slate-950"
            >
              <option>All Types</option>
              <option>Full Time</option>
              <option>Internship</option>
            </select>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const Icon = job.icon;

                return (
                  <article
                    key={job.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-[#003566]/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
                        <Icon size={24} />
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold transition group-hover:text-[#003566] dark:group-hover:text-blue-400">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {job.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={15} />
                        {job.department}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} />
                        {job.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={15} />
                        {job.experience}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-400">
                        Oikko Bank Careers
                      </span>

                      <a
                        href={`mailto:careers@oikkobank.com?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#003566] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#00264d]"
                      >
                        Apply Now
                        <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700 lg:col-span-2">
                <Search size={32} className="mx-auto text-slate-400" />

                <h3 className="mt-4 font-bold">No positions found</h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search or department filters.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setDepartment("All Departments");
                    setJobType("All Types");
                  }}
                  className="mt-5 text-sm font-semibold text-[#003566] hover:underline dark:text-blue-400"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-400">
            Note: The positions above are sample listings for the Oikko Bank
            project. Replace them with verified vacancies before publishing.
          </p>
        </div>
      </section>

      {/* Recruitment Process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
            How We Hire
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Our Recruitment Process
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
            A simple and transparent journey from application to becoming
            part of our team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recruitmentSteps.map((step, index) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-4xl font-bold text-blue-100 dark:text-blue-950">
                {step.number}
              </span>

              <h3 className="mt-4 font-bold">{step.title}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                {step.description}
              </p>

              {index !== recruitmentSteps.length - 1 && (
                <ChevronRight
                  size={19}
                  className="absolute right-5 top-8 hidden text-slate-300 lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Career CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#003566] p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <HeartHandshake size={25} />
              </div>

              <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
                Don&apos;t see the right role?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
                We are always interested in connecting with talented people.
                Send us your CV and introduce yourself to our recruitment team.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/10 p-6">
              <div className="flex items-center gap-3">
                <Mail size={22} className="text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">
                    Career Inquiries
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    careers@oikkobank.com
                  </p>
                </div>
              </div>

              <a
                href="mailto:careers@oikkobank.com?subject=General%20Career%20Inquiry"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
              >
                <Send size={17} />
                Send Your CV
                <ArrowRight size={17} />
              </a>

              <p className="text-center text-[11px] text-blue-200">
                Use your professional email to contact our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Note */}
      <section className="border-t border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs leading-6 text-slate-400">
          <ShieldCheck
            size={17}
            className="shrink-0 text-[#003566] dark:text-blue-400"
          />
          <p>
            Oikko Bank is committed to providing a fair and respectful
            recruitment experience. All job information should be verified
            through official recruitment channels.
          </p>
        </div>
      </section>
    </main>
  );
};

export default CareerPage;
