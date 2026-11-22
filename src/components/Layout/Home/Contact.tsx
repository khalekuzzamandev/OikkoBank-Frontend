import React from "react";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin, FiClock, FiMessageCircle } from "react-icons/fi";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

const contactInfo = [
  {
    icon: FiPhone,
    title: "Phone",
    lines: ["+880 1700-000000", "+880 2-9876543"],
    href: "tel:+8801700000000",
  },
  {
    icon: FiMail,
    title: "Email",
    lines: ["info@oikkobank.com", "support@oikkobank.com"],
    href: "mailto:info@oikkobank.com",
  },
  {
    icon: FiMapPin,
    title: "Head Office",
    lines: ["Oikko Bank Tower, 45 Gulshan Avenue", "Gulshan-1, Dhaka-1212"],
    href: undefined,
  },
  {
    icon: FiClock,
    title: "Office Hours",
    lines: ["Sunday - Thursday: 10:00 AM - 5:00 PM", "Friday & Saturday: Closed"],
    href: undefined,
  },
];

const socials = [
  { icon: FaFacebookF, name: "Facebook", href: "https://facebook.com/oikkobank" },
  { icon: FaLinkedinIn, name: "LinkedIn", href: "https://linkedin.com/company/oikkobank" },
  { icon: FaXTwitter, name: "Twitter", href: "https://twitter.com/oikkobank" },
  { icon: FaYoutube, name: "YouTube", href: "https://youtube.com/@oikkobank" },
  { icon: FaInstagram, name: "Instagram", href: "https://instagram.com/oikkobank" },
];

const inputClass =
  "w-full rounded-md border border-[#003566]/30 bg-white px-3 py-2.5 text-sm text-[#003566] outline-none transition placeholder:text-[#003566]/50 focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/20";
const labelClass = "mb-1 block text-xs font-medium text-[#003566]";

const Contact = () => {
  return (
    <section className="w-full bg-[#003566] py-12 sm:py-16 shadow border-b border-[#ff7900]/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="border-b border-[#003566]/15 px-6 py-6 text-center sm:px-10">
            <h1 className="text-2xl font-bold text-[#003566] sm:text-3xl">Contact Us</h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-[#003566]/80">
              If you have any questions, suggestions or complaints, please let us
              know. Our customer service team will get back to you within 24
              hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-5">
            <div className="bg-[#003566] p-6 text-white sm:p-8 lg:col-span-2">
              <h2 className="mb-5 text-lg font-semibold">Contact Information</h2>

              <div className="space-y-5">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const body = (
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#003566]">
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        {item.lines.map((line) => (
                          <p key={line} className="text-sm text-white/80">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.title} href={item.href} className="block transition hover:opacity-80">
                      {body}
                    </a>
                  ) : (
                    <div key={item.title}>{body}</div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-white/25 pt-5">
                <p className="mb-1 text-xs uppercase tracking-wide text-white/70">
                  24/7 Hotline
                </p>
                <a href="tel:16000" className="text-3xl font-bold">
                  16000
                </a>
                <p className="mt-1 text-sm text-white/80">
                  Live chat available 10:00 AM - 5:00 PM
                </p>
              </div>

              <div className="mt-6 border-t border-white/25 pt-5">
                <p className="mb-3 text-xs uppercase tracking-wide text-white/70">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        aria-label={s.name}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-white transition hover:bg-white hover:text-[#003566]"
                      >
                        <Icon size={16} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:col-span-3">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#003566]">
                <FiMessageCircle size={20} />
                Send Us a Message
              </h2>

              <form className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Your Name</label>
                  <input id="name" name="name" placeholder="Full name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Mobile Number</label>
                  <input id="phone" name="phone" placeholder="01XXXXXXXXX" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <select id="subject" name="subject" defaultValue="" className={inputClass}>
                    <option value="" disabled>Select</option>
                    <option value="account">Account Related</option>
                    <option value="loan">Loan Related</option>
                    <option value="card">Card Related</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" name="message" rows={6} placeholder="Write your message..." className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    className="w-full rounded-md bg-[#003566] px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#003566]/85 sm:w-auto"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;