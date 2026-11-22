'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';

const linksColumn1 = [
  { name: 'Annual Reports', href: '/annual-reports' },
  { name: 'Fees & Charges', href: '/fees' },
  { name: 'Anti-Money Laundering', href: '/aml' },
  { name: 'Customer Care', href: '/customer-care' },
  { name: 'Staff Webmail', href: '/webmail' },
  { name: 'Financial Inclusion', href: '/financial-inclusion' },
  { name: 'Careers', href: '/careers' },
  { name: 'Branch & ATM Locator', href: '/locations' },
];

const linksColumn2 = [
  { name: 'Downloads', href: '/downloads' },
  { name: 'Notices', href: '/notices' },
  { name: 'Code of Ethics', href: '/ethics' },
  { name: 'Tenders', href: '/tenders' },
  { name: 'Press Room', href: '/press' },
  { name: 'Investor Relations', href: '/investors' },
  { name: 'FAQs', href: '/faq' },
  { name: 'Useful Links', href: '/links' },
];

const bottomLinks = [
  { name: 'Contact Us', href: '/contact' },
  { name: 'Sitemap', href: '/sitemap' },
  { name: 'Legal Notices', href: '/legal' },
  { name: 'Privacy Policy', href: '/privacy' },
];

const LinkList = ({ items }: { items: { name: string; href: string }[] }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className="flex items-center gap-2.5 text-sm text-white transition-colors hover:text-[#7DB5F0]"
        >
          <span className="h-3.5 w-0.5 shrink-0 bg-[#4C9BEA]" />
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#003566] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Logo + description */}
          <div className="lg:col-span-4 ">
            <Link href="/" className="inline-block rounded-md bg-white p-1">
              <Image
                src="/images/oikko bank logo.PNG"
                alt="Oikko Bank"
                width={200}
                height={80}
                className="h-auto w-40 object-contain"
              />
            </Link>

            <p className="mt-6 text-sm leading-6 text-white/90">
              Oikko Bank PLC. is a modern commercial bank committed to simple,
              secure and accessible banking for everyone. With a growing network
              of branches, agent points and ATMs across the country, we serve
              individuals, families and businesses with reliable financial
              solutions built on trust and transparency.
            </p>
          </div>

          {/* Links column 1 */}
          <div className="lg:col-span-3 lg:col-start-6">
            <LinkList items={linksColumn1} />
          </div>

          {/* Links column 2 */}
          <div className="lg:col-span-3">
            <LinkList items={linksColumn2} />
          </div>

          {/* Scroll to top */}
          <div className="hidden lg:col-span-1 lg:flex lg:justify-end">
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1762AE] text-white transition hover:bg-[#2A7BD0]"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-[#4C9BEA]/40" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-5 text-center text-xs md:flex-row md:text-left">
          <p className="font-semibold">
            Copyright &copy; {new Date().getFullYear()} Oikko Bank PLC. All
            rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-2 font-medium">
            {bottomLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link href={link.href} className="hover:text-[#7DB5F0]">
                  {link.name}
                </Link>
                {index < bottomLinks.length - 1 && (
                  <span className="text-white/60">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile scroll to top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1762AE] text-white transition hover:bg-[#2A7BD0] lg:hidden"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;