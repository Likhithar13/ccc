import {
  ArrowUpRight,
  BarChart3,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { RiskClassification, SessionAnalysisRecord } from "../types/analysis";
import type { AppPage } from "./Navbar";

interface DashboardPageProps {
  records: SessionAnalysisRecord[];
  onViewRecord: (record: SessionAnalysisRecord) => void;
  onClearRecords: () => void;
  onNavigate: (page: AppPage) => void;
}

type FilterOption = "ALL" | RiskClassification;

const CLASSIFICATION_COLORS: Record<RiskClassification, string> = {
  LOW: "#16A34A",
  MEDIUM: "#D97706",
  HIGH: "#DC2626",
  "INSUFFICIENT INFORMATION": "#64748B",
};

const CLASSIFICATION_TEXT: Record<RiskClassification, string> = {
  LOW: "text-emerald-700",
  MEDIUM: "text-amber-700",
  HIGH: "text-red-700",
  "INSUFFICIENT INFORMATION": "text-slate-600",
};

export function DashboardPage({
  records,
  onViewRecord,
  onClearRecords,
  onNavigate,
}: DashboardPageProps) {
  const [filter, setFilter] = useState<FilterOption>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    const summary = {
      total: records.length,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      "INSUFFICIENT INFORMATION": 0,
    };
    for (const rec of records) {
      summary[rec.report.riskClassification] += 1;
    }
    return summary;
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      if (filter !== "ALL" && rec.report.riskClassification !== filter) {
        return false;
      }
      if (!q) return true;
      return (
        rec.companyName.toLowerCase().includes(q) ||
        rec.source.toLowerCase().includes(q) ||
        rec.advertisementSnippet.toLowerCase().includes(q)
      );
    });
  }, [records, filter, searchQuery]);

  // SVG Donut chart segments calculated strictly from actual session counts
  const donutSegments = useMemo(() => {
    const categories: RiskClassification[] = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "INSUFFICIENT INFORMATION",
    ];
    const total = counts.total;
    if (total === 0) return [];

    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    let cumulativeFraction = 0;

    return categories
      .map((cat) => {
        const count = counts[cat];
        const fraction = count / total;
        const strokeDasharray = `${fraction * circumference} ${circumference}`;
        const strokeDashoffset = -cumulativeFraction * circumference;
        cumulativeFraction += fraction;
        return {
          classification: cat,
          count,
          percentage: Math.round(fraction * 100),
          color: CLASSIFICATION_COLORS[cat],
          strokeDasharray,
          strokeDashoffset,
        };
      })
      .filter((seg) => seg.count > 0);
  }, [counts]);

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0B162C]">
            Current Session Dashboard
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Session analytics update in real time as you analyse job and
            internship advertisements. No simulated or pre-populated metrics are
            shown.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <BarChart3 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-[#0B162C]">
            No advertisements analysed in this session yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Submit a job posting or test one of the three fictional sample
            advertisements in the Analyser to populate session counts and
            distribution charts.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("analyser")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Go to Advertisement Analyser
          </button>
        </div>
      </div>
    );
  }

  const recentForBarChart = records.slice(0, 8).reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0B162C]">
            Current Session Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Live session metrics from your active browser session ·{" "}
            <span className="tabular-nums">
              {counts["INSUFFICIENT INFORMATION"]} insufficient information
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClearRecords}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Clear Session Data</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Total Analysed
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-[#0B162C] tabular-nums">
            {counts.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">Current session total</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            Low Risk
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-[#0B162C] tabular-nums">
            {counts.LOW}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {Math.round((counts.LOW / counts.total) * 100)}% of session
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
            Medium Risk
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-[#0B162C] tabular-nums">
            {counts.MEDIUM}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {Math.round((counts.MEDIUM / counts.total) * 100)}% of session
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-wider text-red-700 uppercase">
            High Risk
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-[#0B162C] tabular-nums">
            {counts.HIGH}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {Math.round((counts.HIGH / counts.total) * 100)}% of session
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Donut Distribution Chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <h2 className="font-display text-base font-bold text-[#0B162C]">
            Risk Classification Distribution
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Proportion of session advertisements by classification.
          </p>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <svg
              viewBox="0 0 144 144"
              className="h-36 w-36 shrink-0"
              role="img"
              aria-label="Risk classification distribution chart"
            >
              <circle
                cx="72"
                cy="72"
                r="56"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="18"
              />
              <g transform="rotate(-90 72 72)">
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.classification}
                    cx="72"
                    cy="72"
                    r="56"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                  />
                ))}
              </g>
              <text
                x="72"
                y="68"
                textAnchor="middle"
                className="fill-[#0B162C] font-mono text-xl font-bold"
              >
                {counts.total}
              </text>
              <text
                x="72"
                y="86"
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                Analysed
              </text>
            </svg>

            <div className="w-full space-y-2.5 text-sm">
              {(
                [
                  "LOW",
                  "MEDIUM",
                  "HIGH",
                  "INSUFFICIENT INFORMATION",
                ] as RiskClassification[]
              ).map((cat) => {
                const count = counts[cat];
                const pct = Math.round((count / counts.total) * 100);
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1.5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-xs"
                        style={{ backgroundColor: CLASSIFICATION_COLORS[cat] }}
                      />
                      <span className="truncate text-xs font-medium text-slate-700">
                        {cat}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#0B162C] tabular-nums shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Indicative Risk Score Bar Chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <h2 className="font-display text-base font-bold text-[#0B162C]">
            Indicative Risk Scores by Submission
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Most recent {recentForBarChart.length} session analyses (indicative
            0–100 scale, not a probability).
          </p>

          <div className="mt-6 space-y-3">
            {recentForBarChart.map((rec, index) => {
              const color =
                CLASSIFICATION_COLORS[rec.report.riskClassification];
              return (
                <div key={rec.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="truncate font-medium text-slate-700">
                      #{index + 1} · {rec.companyName}
                    </span>
                    <span className="font-mono font-semibold text-[#0B162C] tabular-nums shrink-0">
                      {rec.report.indicativeRiskScore}/100 ·{" "}
                      {rec.report.riskClassification}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${rec.report.indicativeRiskScore}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recent Analysis Results Table */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center">
          <h2 className="font-display text-lg font-bold text-[#0B162C]">
            Recent Analysis Results
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company or text..."
                aria-label="Search recent analyses"
                className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none sm:w-56"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
              {(
                [
                  "ALL",
                  "HIGH",
                  "MEDIUM",
                  "LOW",
                  "INSUFFICIENT INFORMATION",
                ] as FilterOption[]
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    filter === option
                      ? "bg-white text-[#0B162C] shadow-xs"
                      : "text-slate-600 hover:text-[#0B162C]"
                  }`}
                >
                  {option === "INSUFFICIENT INFORMATION" ? "INSUFFICIENT" : option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-2.5 pr-4">Company &amp; Source</th>
                <th className="py-2.5 pr-4">Snippet</th>
                <th className="py-2.5 pr-4 whitespace-nowrap">Classification</th>
                <th className="py-2.5 pr-4 text-right whitespace-nowrap">Score</th>
                <th className="py-2.5 pr-4 whitespace-nowrap">Time</th>
                <th className="py-2.5 text-right whitespace-nowrap">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    No session records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="py-3 pr-4 align-top">
                      <p className="font-semibold text-[#0B162C]">
                        {rec.companyName}
                      </p>
                      <p className="text-xs text-slate-500">{rec.source}</p>
                    </td>
                    <td className="max-w-xs py-3 pr-4 align-top text-xs text-slate-600">
                      <p className="line-clamp-2">{rec.advertisementSnippet}</p>
                    </td>
                    <td className="py-3 pr-4 align-top whitespace-nowrap">
                      <span
                        className={`text-xs font-bold ${
                          CLASSIFICATION_TEXT[rec.report.riskClassification]
                        }`}
                      >
                        {rec.report.riskClassification}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right align-top font-mono text-sm font-semibold text-[#0B162C] tabular-nums">
                      {rec.report.indicativeRiskScore}
                    </td>
                    <td className="py-3 pr-4 align-top font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(rec.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 text-right align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewRecord(rec)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
