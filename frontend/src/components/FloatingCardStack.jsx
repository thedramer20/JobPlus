import React from "react";

const jobs = [
  {
    title: "Full Stack Engineer",
    company: "InnovateLabs",
    salary: "$95k - $125k",
    type: "Remote",
    location: "San Francisco, CA",
    match: "94%",
    accent: "cyan",
    front: true,
  },
  {
    title: "AI Engineer",
    company: "NeuralWorks",
    salary: "$110k - $150k",
    type: "Remote",
    location: "New York, NY",
    match: "87%",
    accent: "blue",
  },
  {
    title: "Product Designer",
    company: "DesignFlow",
    salary: "$85k - $120k",
    type: "Hybrid",
    location: "Austin, TX",
    match: "81%",
    accent: "purple",
  },
];

export default function FloatingCardStack() {
  return (
    <div className="relative h-[520px] w-full max-w-[560px]">
      {/* Enhanced ambient glow effects */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-purple-500/20 blur-[120px]" />
      <div className="absolute bottom-10 left-1/2 h-20 w-80 -translate-x-1/2 rounded-full bg-cyan-400/40 blur-3xl" />

      {/* Stacked cards with enhanced depth and glassmorphism */}
      <JobCard
        job={jobs[2]}
        className="absolute right-2 top-28 z-10 rotate-[12deg] scale-[0.85] opacity-40 blur-[0.5px]"
      />
      <JobCard
        job={jobs[1]}
        className="absolute right-12 top-20 z-20 rotate-[6deg] scale-[0.92] opacity-60"
      />
      <JobCard
        job={jobs[0]}
        className="absolute right-24 top-8 z-30 rotate-[-6deg] transition-all duration-500 hover:-translate-y-4 hover:rotate-[-3deg] hover:scale-[1.02]"
        front
      />
    </div>
  );
}

function JobCard({ job, className = "", front = false }) {
  const accentClasses = {
    cyan: {
      border: "border-cyan-300/50",
      glow: "shadow-[0_0_80px_rgba(34,211,238,0.4),0_0_40px_rgba(34,211,238,0.2)]",
      badge:
        "border-cyan-300/50 bg-cyan-400/15 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.5)]",
      text: "text-cyan-300",
    },
    blue: {
      border: "border-blue-400/45",
      glow: "shadow-[0_0_70px_rgba(59,130,246,0.35),0_0_35px_rgba(59,130,246,0.15)]",
      badge:
        "border-blue-400/45 bg-blue-500/15 text-blue-300 shadow-[0_0_35px_rgba(59,130,246,0.4)]",
      text: "text-blue-300",
    },
    purple: {
      border: "border-purple-400/45",
      glow: "shadow-[0_0_70px_rgba(168,85,247,0.35),0_0_35px_rgba(168,85,247,0.15)]",
      badge:
        "border-purple-400/45 bg-purple-500/15 text-purple-300 shadow-[0_0_35px_rgba(168,85,247,0.4)]",
      text: "text-purple-300",
    },
  };

  const accent = accentClasses[job.accent];

  return (
    <article
      className={`
        group relative h-[390px] w-[310px] rounded-[2rem]
        border ${accent.border}
        bg-gradient-to-br from-[#0a1528]/85 via-[#08111f]/90 to-[#0d1a2e]/85
        p-7
        text-white backdrop-blur-3xl
        ${accent.glow}
        before:pointer-events-none before:absolute before:inset-0 before:rounded-[2rem]
        before:bg-gradient-to-br before:from-white/15 before:via-white/[0.03] before:to-transparent
        after:pointer-events-none after:absolute after:inset-0 after:rounded-[2rem]
        after:bg-gradient-to-tr after:from-transparent after:via-transparent after:to-white/5
        ${front ? "ring-1 ring-white/20 ring-offset-2 ring-offset-[#050712]" : ""}
        ${className}
      `}
    >
      <div className="relative z-10">
        {/* Top section: logo and match badge */}
        <div className="mb-12 flex items-start justify-between">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.08] shadow-inner backdrop-blur-sm">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-white via-cyan-300 to-blue-600 [clip-path:polygon(0_100%,100%_0,100%_100%)] shadow-lg" />
          </div>
          <div
            className={`rounded-2xl border px-5 py-3 text-center ${accent.badge}`}
          >
            <div className="text-2xl font-black leading-none">
              ✦ {job.match}
            </div>
            <div className="mt-1 text-sm font-semibold italic">match</div>
          </div>
        </div>

        {/* Job title with enhanced typography */}
        <h3 className="text-4xl font-black leading-[1.05] tracking-tight">
          {job.title.split(" ")[0]} {job.title.split(" ")[1]}
          <br />
          {job.title.split(" ").slice(2).join(" ")}
        </h3>

        {/* Company name with enhanced verified badge */}
        <div className="mt-6 flex items-center gap-2">
          <p className={`text-lg font-semibold ${accent.text}`}>
            {job.company}
          </p>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs text-white shadow-lg">
            ✓
          </span>
        </div>

        {/* Enhanced divider with gradient */}
        <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Job details: salary and type */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
          <span className="inline-flex items-center gap-2">
            <IconCircleDollar />
            {job.salary}
          </span>
          <span className="h-5 w-px bg-white/15" />
          <span className="inline-flex items-center gap-2">
            <IconWifi />
            {job.type}
          </span>
        </div>

        {/* Location */}
        <div className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-300">
          <IconLocation />
          {job.location}
        </div>
      </div>
    </article>
  );
}

function IconCircleDollar() {
  return (
    <svg
      className="h-5 w-5 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M15 9.5c-.8-.8-1.8-1.2-3-1.2-1.6 0-2.8.8-2.8 2s1 1.7 2.8 2.1c1.9.4 3 .9 3 2.2s-1.2 2.1-3 2.1c-1.3 0-2.5-.5-3.4-1.4" />
    </svg>
  );
}

function IconWifi() {
  return (
    <svg
      className="h-5 w-5 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg
      className="h-5 w-5 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
