import { ArrowRight } from "lucide-react";

const ARCHITECTURE_LAYERS = [
  {
    layer: "01. Client Presentation Layer",
    tech: "React 19, TypeScript, Tailwind CSS v4",
    role: "Provides the responsive SaaS interface, advertisement submission form, sample test case loaders, structured report renderer, and in-memory session dashboard.",
  },
  {
    layer: "02. Application API Layer",
    tech: "Node.js + Express Server (server.ts)",
    role: "Validates incoming payloads (25–15,000 characters), enforces security boundaries by keeping API credentials strictly server-side, handles retries, and normalizes structured responses.",
  },
  {
    layer: "03. AI Inference Layer",
    tech: "Google GenAI SDK (@google/genai) · gemini-3.1-flash-lite",
    role: "Evaluates postings against the nine-factor recruitment fraud rubric using JSON Schema enforcement (responseSchema) to return consistent classifications, evidence quotes, and verification steps.",
  },
];

const WORKFLOW_SEQUENCE = [
  "Student or graduate opens the Analyser page and pastes a job/internship posting (or loads one of three fictional sample cases), optionally entering Company Name and Advertisement Source.",
  "Client validates minimum text length and dispatches a POST request to /api/analyze over HTTPS without exposing any API secrets in browser code.",
  "Express backend sanitizes and validates the input, verifies server-side GEMINI_API_KEY configuration, and constructs the structured prompt.",
  "Server invokes Google Gemini (gemini-3.1-flash-lite) with responseMimeType: 'application/json' and a strict responseSchema covering all nine fraud criteria.",
  "Gemini returns the classification (LOW, MEDIUM, HIGH, or INSUFFICIENT INFORMATION), indicative risk score (0–100), warning signs with verbatim evidence quotes, positive cues, missing fields, and verification advice.",
  "Backend normalizes and returns the JSON payload; the frontend renders the visual report and updates the current-session Dashboard charts in browser memory.",
];

export function DocumentationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
          Academic &amp; Engineering Reference
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B162C]">
          JobShield AI — Project Documentation
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Comprehensive system overview covering problem definition,
          architecture, Gemini AI integration, expected outcomes, and ethical
          limitations.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Project Description */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            1. Project Description
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            JobShield AI is a full-stack, cloud-ready web application designed to
            help college students and fresh graduates screen job and internship
            advertisements for indicators of recruitment fraud. Using Google
            Gemini through a secure server-side API, the system inspects
            unstructured posting text—commonly shared on messaging groups,
            social feeds, or unsolicited emails—and translates it into a
            structured, evidence-backed risk report with actionable verification
            guidance.
          </p>
        </section>

        {/* 2. Problem Statement */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            2. Problem Statement
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Early-career candidates frequently encounter fraudulent internship
            and entry-level job postings that exploit urgency, guaranteed-offer
            claims, and upfront registration or training kit fees. Because these
            listings circulate informally outside vetted university placement
            portals, students often struggle to distinguish legitimate startup
            opportunities from deceptive schemes before paying money or sharing
            sensitive identity documents.
          </p>
        </section>

        {/* 3. Objectives */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            3. Objectives
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>
              Provide an accessible web tool where students can submit raw job
              or internship advertisements for structured AI evaluation.
            </li>
            <li>
              Inspect submissions across nine concrete fraud indicators,
              including fee solicitation, unrealistic compensation, urgency
              tactics, missing corporate identity, and sensitive data requests.
            </li>
            <li>
              Anchor every warning sign to verbatim textual evidence so users
              can understand why a flag was raised.
            </li>
            <li>
              Maintain strict API credential isolation on the backend and avoid
              permanent storage of user-submitted advertisements by default.
            </li>
            <li>
              Present honest analytical boundaries so users treat AI scores as
              verification aids rather than definitive proof of fraud.
            </li>
          </ul>
        </section>

        {/* 4. Technology Stack */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            4. Technology Stack
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-2 pr-4">Layer</th>
                  <th className="py-2 pr-4">Technology</th>
                  <th className="py-2">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#0B162C]">
                    Frontend UI
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">
                    React 19 · TypeScript · Vite
                  </td>
                  <td className="py-2.5">
                    Modular SPA views, accessible forms, SVG session charts
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#0B162C]">
                    Styling System
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">
                    Tailwind CSS v4 · Lucide Icons
                  </td>
                  <td className="py-2.5">
                    Responsive desktop and mobile SaaS layout
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#0B162C]">
                    Backend Server
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">
                    Node.js · Express · tsx
                  </td>
                  <td className="py-2.5">
                    Input validation, rate/error handling, static serving
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#0B162C]">
                    AI Engine
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">
                    @google/genai · gemini-3.1-flash-lite
                  </td>
                  <td className="py-2.5">
                    Schema-constrained JSON risk and evidence extraction
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#0B162C]">
                    Hosting &amp; Secrets
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">
                    Cloud Run / AI Studio Build
                  </td>
                  <td className="py-2.5">
                    Managed environment injection of GEMINI_API_KEY
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. System Architecture */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            5. System Architecture
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            JobShield AI follows a clean three-tier client–server architecture
            where the browser communicates exclusively with local Express API
            endpoints.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {ARCHITECTURE_LAYERS.map((item, idx) => (
              <div
                key={item.layer}
                className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-[#0B162C]">
                    {item.layer}
                  </span>
                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <ArrowRight
                      className="hidden h-4 w-4 text-blue-700 md:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-blue-700">{item.tech}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Step-by-Step Workflow */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            6. Step-by-Step Workflow
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {WORKFLOW_SEQUENCE.map((step, idx) => (
              <li key={step} className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums mt-0.5">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 7. AI Integration Explanation */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            7. Gemini AI Integration Explanation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            The backend initializes{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              GoogleGenAI
            </code>{" "}
            using the server-only{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              process.env.GEMINI_API_KEY
            </code>{" "}
            environment variable and calls{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              ai.models.generateContent
            </code>{" "}
            with{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              gemini-3.1-flash-lite
            </code>
            . Rather than accepting free-form prose, the server passes a formal{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              responseSchema
            </code>{" "}
            via{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0B162C]">
              responseMimeType: &quot;application/json&quot;
            </code>
            . This guarantees machine-readable fields for the four-level
            classification, 0–100 indicative score, verbatim warning evidence,
            positive indicators, missing details, verification steps, and the
            nine-criterion inspection breakdown. Transient network failures use
            exponential backoff retries, while authentication or quota errors
            propagate transparently to the user.
          </p>
        </section>

        {/* 8. Expected Outcomes */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-[#0B162C]">
            8. Expected Outcomes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>
              Faster early screening of suspicious internship and graduate job
              forwards before candidates pay registration deposits.
            </li>
            <li>
              Improved student awareness of recruitment hygiene—such as checking
              official email domains and verifying placement cell records.
            </li>
            <li>
              Transparent, explainable outputs linking every warning directly to
              evidence inside the advertisement text.
            </li>
          </ul>
        </section>

        {/* 9. Limitations */}
        <section className="rounded-xl border border-slate-200 bg-[#0B162C] p-6 text-white">
          <h2 className="font-display text-xl font-bold">
            9. Limitations &amp; Responsible Use
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
            <li>
              <strong className="text-white">Indicative Scoring:</strong> The
              0–100 risk score is an AI heuristic summary and is not a
              statistically validated fraud probability.
            </li>
            <li>
              <strong className="text-white">No Definitive Accusations:</strong>{" "}
              AI text analysis cannot prove an organisation is fraudulent; even
              poorly written legitimate startup postings may trigger medium risk
              or insufficient-information flags.
            </li>
            <li>
              <strong className="text-white">Brand Impersonation:</strong>{" "}
              Scammers can copy text and company names from real firms; users
              must still verify recruiter email domains and official career
              websites.
            </li>
            <li>
              <strong className="text-white">Session-Only Analytics:</strong>{" "}
              Dashboard history is intentionally scoped to the current browser
              session so submitted advertisements are not retained permanently.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
