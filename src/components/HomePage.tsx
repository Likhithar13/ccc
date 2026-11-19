import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { AppPage } from "./Navbar";

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  onLaunchSample: () => void;
}

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Paste the Advertisement",
    detail:
      "Copy any job or internship posting from WhatsApp, email, social media, or campus boards, along with optional company name and source context.",
  },
  {
    number: "02",
    title: "Structured Gemini Inspection",
    detail:
      "Our backend invokes Google Gemini with a nine-point recruitment fraud rubric, extracting warning signs and verbatim evidence quotes.",
  },
  {
    number: "03",
    title: "Verify Before You Apply",
    detail:
      "Review the indicative risk score, flagged missing details, and a practical verification checklist before sharing documents or money.",
  },
];

const NINE_CHECKS = [
  {
    title: "Upfront Registration or Kit Fees",
    description:
      "Detects requests for security deposits, training charges, processing fees, or UPI transfers prior to hiring.",
  },
  {
    title: "Unrealistic Compensation Claims",
    description:
      "Flags unusually high stipends or salaries promised for minimal hours or zero prior experience.",
  },
  {
    title: "Suspicious Recruitment Language",
    description:
      "Identifies phrases such as guaranteed selection, no interview required, or instant offer letters.",
  },
  {
    title: "Pressure Tactics & Urgency",
    description:
      "Spots artificial countdowns, limited-seat threats, and same-day payment deadlines.",
  },
  {
    title: "Missing Corporate Identity",
    description:
      "Checks whether legal business name, official domain website, and physical office details are omitted.",
  },
  {
    title: "Unprofessional Communication",
    description:
      "Evaluates reliance on personal free webmail domains or WhatsApp-only screening.",
  },
  {
    title: "Sensitive Data Solicitation",
    description:
      "Flags premature requests for national ID scans, bank account details, or payment screenshots.",
  },
  {
    title: "Vague Job Responsibilities",
    description:
      "Assesses whether actual daily duties, skills, and reporting structure are clearly specified.",
  },
  {
    title: "Unusual Selection Procedures",
    description:
      "Contrasts the described hiring flow against standard technical or HR evaluation stages.",
  },
];

export function HomePage({ onNavigate, onLaunchSample }: HomePageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                Student &amp; Graduate Recruitment Safety
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#0B162C] sm:text-5xl text-balance leading-[1.12]">
                Verify job and internship offers before you share your details
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                JobShield AI analyses recruitment advertisements using Google
                Gemini to surface financial red flags, missing company details,
                and pressure tactics—giving students clear evidence and practical
                verification steps.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("analyser")}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span>Analyse Advertisement</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onLaunchSample}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0B162C] transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <FileSearch className="h-4 w-4 text-blue-700" aria-hidden="true" />
                  <span>Try Sample Cases</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <span>Nine-factor recruitment rubric</span>
                <span aria-hidden="true">·</span>
                <span>Verbatim evidence extraction</span>
                <span aria-hidden="true">·</span>
                <span>Zero permanent text storage</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-[#0B162C]">
                {!imageFailed ? (
                  <img
                    src="/src/assets/images/hero_campus_verification_1795079956120.jpg"
                    alt="University student reviewing a job offer document on a laptop in a sunlit library"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B162C] via-[#13294B] to-[#1D4ED8] p-8 text-center text-white">
                    <ShieldCheck className="h-12 w-12 text-blue-300" aria-hidden="true" />
                    <p className="mt-4 font-display text-xl font-semibold">
                      JobShield AI Inspection Workspace
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-slate-300">
                      Structured Gemini analysis for student job and internship postings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the System Works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B162C] sm:text-3xl">
            How JobShield AI Works
          </h2>
          <p className="mt-2 text-base text-slate-600">
            A transparent three-stage pipeline connecting your browser to a
            server-side Gemini AI evaluator.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-[#0B162C]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Nine Factors Examined */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B162C] sm:text-3xl">
                What the AI Examines
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Every submitted advertisement is inspected across nine specific
                patterns common in student-targeted recruitment scams.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("documentation")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              <span>Read Technical Documentation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {NINE_CHECKS.map((item, idx) => (
              <div key={item.title} className="bg-white p-6">
                <span className="font-mono text-xs font-medium text-slate-400 tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold text-[#0B162C]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features and Honest Limitations */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-7">
            <div className="flex items-center gap-2.5 text-[#0B162C]">
              <CheckCircle2 className="h-5 w-5 text-blue-700" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold">Key Capabilities</h2>
            </div>
            <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                <span>
                  <strong className="font-semibold text-[#0B162C]">
                    Evidence-Backed Warnings:
                  </strong>{" "}
                  Quotes exact phrases from the advertisement alongside each
                  identified risk factor.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                <span>
                  <strong className="font-semibold text-[#0B162C]">
                    Four-State Classification:
                  </strong>{" "}
                  Distinguishes between LOW, MEDIUM, HIGH, and INSUFFICIENT
                  INFORMATION when details are missing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                <span>
                  <strong className="font-semibold text-[#0B162C]">
                    Actionable Verification Steps:
                  </strong>{" "}
                  Generates concrete checks tailored to the specific posting,
                  such as domain lookup and placement cell confirmation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                <span>
                  <strong className="font-semibold text-[#0B162C]">
                    Privacy-First Session Analytics:
                  </strong>{" "}
                  Tracks session statistics in browser memory without permanently
                  storing submitted postings on a database.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#0B162C] p-7 text-white">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold">
                Limitations &amp; Responsible Interpretation
              </h2>
            </div>
            <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-slate-300">
              <li className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-white">
                    Not Legal Proof of Fraud:
                  </strong>{" "}
                  JobShield AI evaluates linguistic and structural warning signs.
                  A high risk rating does not legally establish that an employer
                  is fraudulent.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-white">
                    Indicative Score Only:
                  </strong>{" "}
                  The 0–100 score is a heuristic summary of detected risk cues,
                  not a statistically calibrated probability of scam occurrence.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-white">
                    No Live Corporate Registry Lookup:
                  </strong>{" "}
                  Text analysis alone cannot verify real-time corporate
                  registration or impersonation of a legitimate company name.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-white">
                    Human Judgment Required:
                  </strong>{" "}
                  Always cross-check offers with official company career portals
                  and your college placement office.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
