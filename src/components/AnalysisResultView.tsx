import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Info,
  MinusCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type {
  AnalysisReport,
  CriterionStatus,
  RiskClassification,
  SeverityLevel,
} from "../types/analysis";

interface AnalysisResultViewProps {
  report: AnalysisReport;
  companyName?: string;
  source?: string;
  analysedAt?: string;
}

function getRiskStyle(classification: RiskClassification) {
  switch (classification) {
    case "LOW":
      return {
        label: "LOW RISK",
        border: "border-emerald-300",
        bg: "bg-emerald-50",
        text: "text-emerald-900",
        accentText: "text-emerald-700",
        barColor: "bg-emerald-600",
        Icon: ShieldCheck,
      };
    case "MEDIUM":
      return {
        label: "MEDIUM RISK",
        border: "border-amber-300",
        bg: "bg-amber-50",
        text: "text-amber-950",
        accentText: "text-amber-700",
        barColor: "bg-amber-600",
        Icon: AlertTriangle,
      };
    case "HIGH":
      return {
        label: "HIGH RISK",
        border: "border-red-300",
        bg: "bg-red-50",
        text: "text-red-950",
        accentText: "text-red-700",
        barColor: "bg-red-600",
        Icon: ShieldAlert,
      };
    case "INSUFFICIENT INFORMATION":
    default:
      return {
        label: "INSUFFICIENT INFORMATION",
        border: "border-slate-300",
        bg: "bg-slate-100",
        text: "text-slate-900",
        accentText: "text-slate-700",
        barColor: "bg-slate-500",
        Icon: HelpCircle,
      };
  }
}

function getCriterionBadge(status: CriterionStatus) {
  switch (status) {
    case "FLAGGED":
      return {
        label: "Flagged",
        className: "text-red-700 font-semibold",
        Icon: AlertOctagon,
      };
    case "CLEAR":
      return {
        label: "Clear",
        className: "text-emerald-700 font-semibold",
        Icon: CheckCircle2,
      };
    case "NOT_MENTIONED":
    default:
      return {
        label: "Not Mentioned",
        className: "text-slate-500 font-medium",
        Icon: MinusCircle,
      };
  }
}

function getSeverityText(severity: SeverityLevel) {
  switch (severity) {
    case "HIGH":
      return "text-red-700";
    case "MEDIUM":
      return "text-amber-700";
    case "LOW":
    default:
      return "text-slate-700";
  }
}

export function AnalysisResultView({
  report,
  companyName,
  source,
  analysedAt,
}: AnalysisResultViewProps) {
  const style = getRiskStyle(report.riskClassification);
  const RiskIcon = style.Icon;
  const formattedTime = analysedAt
    ? new Date(analysedAt).toLocaleString()
    : undefined;

  return (
    <div className="space-y-6">
      {/* Primary Classification & Score Card */}
      <section
        aria-label="Overall risk assessment"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <div
          className={`flex flex-col justify-between gap-4 border-b px-6 py-5 sm:flex-row sm:items-center ${style.bg} ${style.border}`}
        >
          <div className="flex items-start gap-3.5">
            <div className={`mt-0.5 shrink-0 ${style.accentText}`}>
              <RiskIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Overall Assessment
              </p>
              <h2 className={`mt-0.5 font-display text-2xl font-bold ${style.text}`}>
                {style.label}
              </h2>
              {(companyName || source || formattedTime) && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  {companyName && <span>{companyName}</span>}
                  {companyName && source && <span aria-hidden="true">·</span>}
                  {source && <span>{source}</span>}
                  {(companyName || source) && formattedTime && (
                    <span aria-hidden="true">·</span>
                  )}
                  {formattedTime && (
                    <span className="tabular-nums">{formattedTime}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-[200px] rounded-lg border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs font-medium text-slate-600">
                Indicative Risk Score
              </span>
              <span className="font-mono text-2xl font-bold text-[#0B162C] tabular-nums">
                {report.indicativeRiskScore}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={report.indicativeRiskScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Indicative risk score"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${style.barColor}`}
                style={{ width: `${report.indicativeRiskScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            AI Analytical Summary
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 sm:text-base">
            {report.explanation}
          </p>

          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <span>
              <strong>Interpretation Notice:</strong> The indicative risk score
              (0–100) reflects AI-detected textual cues and is{" "}
              <strong>not</strong> a statistically validated probability. This
              assessment does not prove an employer is fraudulent; use it to
              guide independent verification.
            </span>
          </div>
        </div>
      </section>

      {/* Warning Signs with Evidence */}
      <section
        aria-label="Identified warning signs"
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-4">
          <h3 className="font-display text-lg font-bold text-[#0B162C]">
            Identified Warning Signs
          </h3>
          <span className="font-mono text-xs font-medium text-slate-500 tabular-nums">
            {report.warningSigns.length} found
          </span>
        </div>

        {report.warningSigns.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            No explicit fraud warning signs were detected in the submitted text.
            Continue reviewing missing information and verification steps below.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-200">
            {report.warningSigns.map((sign, index) => (
              <div key={`${sign.title}-${index}`} className="py-4 first:pt-1 last:pb-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-base font-semibold text-[#0B162C]">
                    {sign.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{sign.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-semibold uppercase ${getSeverityText(sign.severity)}`}>
                      {sign.severity} Severity
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                  {sign.description}
                </p>
                {sign.evidenceQuote && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Evidence from Advertisement
                    </p>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-slate-800">
                      &ldquo;{sign.evidenceQuote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Positive Indicators & Missing Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          aria-label="Positive or reassuring indicators"
          className="rounded-xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3.5">
            <h3 className="font-display text-lg font-bold text-[#0B162C]">
              Positive / Reassuring Indicators
            </h3>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {report.positiveIndicators.length}
            </span>
          </div>

          {report.positiveIndicators.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              No clear reassuring corporate or process indicators were present in
              this advertisement.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {report.positiveIndicators.map((pos, index) => (
                <li key={`${pos.title}-${index}`} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-[#0B162C]">{pos.title}: </span>
                    <span className="text-slate-600">{pos.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-label="Missing information"
          className="rounded-xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3.5">
            <h3 className="font-display text-lg font-bold text-[#0B162C]">
              Missing Information
            </h3>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {report.missingInformation.length}
            </span>
          </div>

          {report.missingInformation.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              All core employer, role, and selection details appear to be stated.
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
              {report.missingInformation.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2.5">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recommended Verification Steps */}
      <section
        aria-label="Recommended verification steps"
        className="rounded-xl border border-slate-200 bg-[#0B162C] p-6 text-white"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-700 pb-3.5">
          <ClipboardCheck className="h-5 w-5 text-blue-300" aria-hidden="true" />
          <h3 className="font-display text-lg font-bold">
            Recommended Verification Steps
          </h3>
        </div>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-200">
          {report.recommendedVerificationSteps.map((step, index) => (
            <li key={`${step}-${index}`} className="flex items-start gap-3">
              <span className="font-mono text-xs font-semibold text-blue-300 tabular-nums mt-0.5">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 9-Factor Inspection Matrix */}
      {report.checkedCriteria.length > 0 && (
        <section
          aria-label="Nine-factor inspection rubric"
          className="rounded-xl border border-slate-200 bg-white p-6"
        >
          <h3 className="font-display text-lg font-bold text-[#0B162C]">
            Nine-Factor Inspection Breakdown
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Status of each fraud-detection dimension evaluated by Gemini AI.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 pr-4">Criterion</th>
                  <th className="py-2.5 pr-4 whitespace-nowrap">Status</th>
                  <th className="py-2.5">Analytical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.checkedCriteria.map((row, idx) => {
                  const badge = getCriterionBadge(row.status);
                  const StatusIcon = badge.Icon;
                  return (
                    <tr key={`${row.criterion}-${idx}`} className="align-top">
                      <td className="py-3 pr-4 font-medium text-[#0B162C]">
                        {row.criterion}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs ${badge.className}`}>
                          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
