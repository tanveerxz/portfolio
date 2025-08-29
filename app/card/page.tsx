"use client";

import React, { useMemo, useState } from "react";
import {
  Copy,
  Mail,
  Phone,
  Globe,
  Download,
  Share2,
  Instagram,
  Linkedin,
  Github,
  ChevronRight,
  Zap,
  Send,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { SiUpwork } from "react-icons/si";

// ====== CONFIG ======
const profile = {
  handle: "@codedbytanveer",
  name: "Tanveer Singh",
  tagline: "Frontend Developer · React / Next.js · London",
  avatar: "/pfp.jpg", // put your image in /public as pfp.jpg
  website: "https://tanveersingh.dev",
  email: "hello@tanveersingh.dev",
  phone: "+44 7459 239 536",
  whatsapp: "+44 7459 239 536",
  highlights: ["Available for freelance", "Book a meeting", "Let’s connect"],
  utm: {
    source: "card",
    medium: "button",
    campaign: "profile",
  },
  // Socials
  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/codedbytanveer",
      icon: Instagram,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tanveerxz/",
      icon: Linkedin,
    },
    { label: "GitHub", href: "https://github.com/tanveerxz", icon: Github },
    {
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/~01931ac7d2599273d8",
      icon: SiUpwork,
    }, // TODO: replace with your real Upwork URL
  ],
  // Projects (featured)
  projects: [
    // {
    //   label: "HukamConnect",
    //   href: "https://www.hukamconnect.com",
    //   icon: Send,
    //   desc: "Daily content platform",
    //   featured: true,
    // },
    {
      label: "IMD Corporation",
      href: "https://imdcorporation.com",
      icon: Globe,
      desc: "Wholesale mobile & devices site",
    },
    {
      label: "HousingPro",
      href: "https://housingpro.vercel.app",
      icon: Zap,
      desc: "Real‑estate listing demo",
    },
    {
      label: "OrbitFind — Waitlist",
      href: "https://orbitfind-waitlist.vercel.app/",
      icon: Send,
      desc: "Join the waitlist",
    },
  ],
  // Other links (utilities)
  links: [
    {
      label: "Portfolio",
      href: "https://tanveersingh.dev",
      icon: Globe,
      desc: "Work, stack, contact",
      featured: true,
    },
    {
      label: "Book a Meeting",
      href: "https://calendly.com/tanveerxz/",
      icon: Calendar,
      desc: "Schedule a call with me",
      featured: true,
    },
    {
      label: "Contact Me",
      href: "/contact",
      icon: Mail,
      desc: "Go to my contact form",
    },
  ],
};
// ====== END CONFIG ======

// Utility to append UTM to external links consistently
function withUtm(url: string, utm = profile.utm) {
  try {
    const u = new URL(url);
    if (utm?.source) u.searchParams.set("utm_source", utm.source);
    if (utm?.medium) u.searchParams.set("utm_medium", utm.medium);
    if (utm?.campaign) u.searchParams.set("utm_campaign", utm.campaign);
    return u.toString();
  } catch {
    return url; // not absolute; just return
  }
}

// vCard generator (downloads a .vcf contact) — no location stored
function downloadVCard() {
  const { name, phone, email, website } = profile;
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${name};;;;`,
    `FN:${name}`,
    email ? `EMAIL;TYPE=INTERNET:${email}` : "",
    phone ? `TEL;TYPE=CELL:${phone}` : "",
    website ? `URL:${website}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.name.replaceAll(" ", "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.15)] ${className}`}
    >
      {children}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  href,
  newTab = true,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
  href?: string;
  newTab?: boolean;
}) {
  const C = (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm/5 font-medium text-white hover:bg-white/20 active:scale-[0.99] transition"
    >
      <Icon size={16} className="opacity-80 group-hover:opacity-100" />
      <span>{label}</span>
    </button>
  );
  if (href) {
    return (
      <a href={href} target={newTab ? "_blank" : undefined} rel="noreferrer">
        {C}
      </a>
    );
  }
  return C;
}

function SocialRow() {
  return (
    <div className="flex justify-center flex-wrap items-center gap-2">
      {profile.socials.map((s) => {
        const Icon = s.icon as any;
        return (
          <a
            key={s.label}
            href={withUtm(s.href)}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          >
            <Icon size={16} className="opacity-80 group-hover:opacity-100" />
            <span className="hidden sm:block">{s.label}</span>
          </a>
        );
      })}
    </div>
  );
}

function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white">
      <div className="truncate">
        <p className="text-xs/4 opacity-70">{label}</p>
        <p className="truncate text-sm/5">{value}</p>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
      >
        <Copy className="size-3.5" /> {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-white/80">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">{children}</div>
    </section>
  );
}

function LinkTile({ label, desc, href, icon: Icon, featured = false }: any) {
  return (
    <a
      href={withUtm(href)}
      target="_blank"
      rel="noreferrer"
      className={`group block rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-white hover:bg-white/10 transition ${
        featured ? "ring-2 ring-indigo-400/50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{label}</p>
            <ChevronRight className="size-4 opacity-60 group-hover:translate-x-0.5 transition" />
          </div>
          {desc && <p className="mt-1 text-sm/5 opacity-80">{desc}</p>}
        </div>
      </div>
    </a>
  );
}

export default function CardPage() {
  const prefilledDM = useMemo(() => {
    const txt = encodeURIComponent(
      "Hey Tanveer — saw your card. I'm interested in a website/app. Can we chat?"
    );
    return `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}?text=${txt}`;
  }, []);

  return (
    <main className="min-h-svh bg-[radial-gradient(60%_80%_at_50%_0%,rgba(88,101,242,0.25),rgba(0,0,0,0)_60%),linear-gradient(180deg,#0a0a0a, #0a0a0a)] text-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:pt-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-16 rounded-2xl border border-white/10"
          />
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm/6 opacity-80">{profile.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
          <ActionButton
            icon={Mail}
            label="Email"
            href={`mailto:${profile.email}`}
          />
          {/* <ActionButton
            icon={Phone}
            label="Call"
            href={`tel:${profile.phone}`}
          /> */}
          <ActionButton
            icon={MessageCircle}
            label="WhatsApp"
            href={prefilledDM}
          />
          <ActionButton
            icon={Download}
            label="Save Contact"
            onClick={downloadVCard}
          />
          <ActionButton
            icon={Calendar}
            label="Book Meeting"
            href={withUtm("https://calendly.com/tanveerxz/")}
          />
          <ActionButton
            icon={Mail}
            label="Contact me"
            href="/contact"
            newTab={false}
          />
          <ActionButton
            icon={Share2}
            label="Share"
            onClick={async () => {
              const data: any = {
                title: `${profile.name} — ${profile.handle}`,
                text: profile.tagline,
                url:
                  typeof window !== "undefined"
                    ? window.location.href
                    : profile.website,
              };
              if ((navigator as any).share) {
                try {
                  await (navigator as any).share(data);
                } catch {}
              } else {
                await navigator.clipboard.writeText(data.url);
                alert("Link copied to clipboard ✨");
              }
            }}
          />
        </div>

        {/* Socials */}
        <div className="mt-6">
          <SocialRow />
        </div>

        {/* Sections */}
        <Section title="Featured Projects">
          {profile.projects.map((p) => (
            <LinkTile key={p.label} {...p} />
          ))}
        </Section>

        <Section title="Links">
          {profile.links.map((l) => (
            <LinkTile key={l.label} {...l} />
          ))}
        </Section>

        {/* Direct contact + copy */}
        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CopyField label="Website" value={profile.website} />
          <CopyField label="Email" value={profile.email} />
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs opacity-60">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
