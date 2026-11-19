import {
  AlertCircle,
  Eraser,
  FileText,
  Loader2,
  Lock,
  SearchCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SAMPLE_ADVERTISEMENTS } from "../data/sampleAds";
import type {
  AnalyzeApiResponse,
  SampleAdvertisement,
  SessionAnalysisRecord,
} from "../types/analysis";
import { AnalysisResultView } from "./AnalysisResultView";

interface AnalyserPageProps {
  activeRecord: SessionAnalysisRecord | null;
  highlightSamplesOnMount?: boolean;
  onConsumeSampleHighlight?: () => void;
  onAnalysisComplete: (record: SessionAnalysisRecord) => void;
}

export function AnalyserPage({
  activeRecord,
  highlightSamplesOnMount,
  onConsumeSampleHighlight,
  onAnalysisComplete,
}: AnalyserPageProps) {
  const [advertisementText, setAdvertisementText] = useState(
    activeRecord?.advertisementText ?? ""
  );
  const [companyName, setCompanyName] = useState(
    activeRecord?.companyName ?? ""
  );
  const [source, setSource] = useState(activeRecord?.source ?? "");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayedRecord, setDisplayedRecord] =
    useState<SessionAnalysisRecord | null>(activeRecord);

  const resultsRef = useRef<HTMLDivElement>(null);
  const samplesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRecord) {
      setDisplayedRecord(activeRecord);
      setAdvertisementText(activeRecord.advertisementText);
      setCompanyName(activeRecord.companyName);
      setSource(activeRecord.source);
    }
  }, [activeRecord]);

  useEffect(() => {
    if (highlightSamplesOnMount && samplesRef.current) {
      samplesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      onConsumeSampleHighlight?.();
    }
  }, [highlightSamplesOnMount, onConsumeSampleHighlight]);

  const handleLoadSample = (sample: SampleAdvertisement) => {
    setSelectedSampleId(sample.id);
    setAdvertisementText(sample.advertisementText);
    setCompanyName(sample.companyName);
    setSource(sample.source);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setSelectedSampleId(null);
    setAdvertisementText("");
    setCompanyName("");
    setSource("");
    setErrorMessage(null);
    setDisplayedRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedText = advertisementText.trim();
    if (trimmedText.length < 25) {
      setErrorMessage(
        "Please paste at least 25 characters of the job or internship advertisement before submitting."
      );
      return;
    }

    if (trimmedText.length > 15000) {
      setErrorMessage(
        "Advertisement text exceeds 15,000 characters. Please shorten the text and try again."
      );
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          advertisementText: trimmedText,
          companyName: companyName.trim(),
          source: source.trim(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as
        | AnalyzeApiResponse
        | { error?: string };

      if (!response.ok) {
        const msg =
          "error" in payload && payload.error
            ? payload.error
            : `Server returned status ${response.status}. Please try again.`;
        setErrorMessage(msg);
        return;
      }

      const data = payload as AnalyzeApiResponse;
      const snippet =
        trimmedText.replace(/\s+/g, " ").slice(0, 110) +
        (trimmedText.length > 110 ? "..." : "");

      const record: SessionAnalysisRecord = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: data.analysedAt || new Date().toISOString(),
        companyName: companyName.trim() || "Unspecified Company",
        source: source.trim() || "Direct Paste",
        advertisementSnippet: snippet,
        advertisementText: trimmedText,
        report: data.report,
      };

      setDisplayedRecord(record);
      onAnalysisComplete(record);

      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMessage(
          "The analysis request timed out after 30 seconds. Please try submitting again."
        );
      } else {
        const msg =
          err instanceof Error
            ? `Network error: ${err.message}`
            : "Unable to reach the analysis server. Please check your connection.";
        setErrorMessage(msg);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0B162C]">
          Advertisement Risk Analyser
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Paste a complete job or internship posting below to evaluate it with
          Google Gemini across nine recruitment fraud indicators.
        </p>
      </div>

      {/* Fictional Sample Test Cases */}
      <section
        ref={samplesRef}
        aria-label="Fictional sample test cases"
        className="mt-8 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-base font-bold text-[#0B162C]">
              Fictional Sample Test Cases
            </h2>
            <p className="text-xs text-slate-500">
              Load any clearly labelled fictional posting into the form below to
              test live Gemini classification.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            3 Test Scenarios Available
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {SAMPLE_ADVERTISEMENTS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  isSelected
                    ? "border-blue-700 bg-blue-50/70"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-blue-700">
                    {sample.scenarioType}
                  </span>
                  <FileText
                    className="h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1.5 font-display text-sm font-semibold text-[#0B162C]">
                  {sample.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {sample.expectedSignal}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="company-name"
              className="block text-sm font-semibold text-[#0B162C]"
            >
              Company Name{" "}
              <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <input
              id="company-name"
              type="text"
              maxLength={150}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Northbridge Cloud Systems"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
            />
          </div>

          <div>
            <label
              htmlFor="ad-source"
              className="block text-sm font-semibold text-[#0B162C]"
            >
              Advertisement Source{" "}
              <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <input
              id="ad-source"
              type="text"
              maxLength={150}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., WhatsApp Group, LinkedIn, Email, Campus Portal"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-4">
            <label
              htmlFor="advertisement-text"
              className="block text-sm font-semibold text-[#0B162C]"
            >
              Job or Internship Advertisement Text{" "}
              <span className="text-red-600">*</span>
            </label>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {advertisementText.length.toLocaleString()} / 15,000 chars
            </span>
          </div>
          <textarea
            id="advertisement-text"
            rows={10}
            value={advertisementText}
            onChange={(e) => {
              setAdvertisementText(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Paste the complete job or internship message, email, or listing text here..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
              aria-hidden="true"
            />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span>
              Analysed securely via backend API; not stored permanently on our
              servers.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading && !advertisementText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <Eraser className="h-4 w-4" aria-hidden="true" />
              <span>Clear Form</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Analysing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Analyse Advertisement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading Skeleton or Results */}
      <div ref={resultsRef} className="mt-8">
        {isLoading && (
          <div
            aria-live="polite"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <Loader2
                className="h-5 w-5 animate-spin text-blue-700"
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-base font-semibold text-[#0B162C]">
                  Inspecting advertisement with Google Gemini
                </p>
                <p className="text-xs text-slate-500">
                  Checking fee requests, compensation claims, corporate identity,
                  and selection procedures...
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        )}

        {!isLoading && displayedRecord && (
          <AnalysisResultView
            report={displayedRecord.report}
            companyName={displayedRecord.companyName}
            source={displayedRecord.source}
            analysedAt={displayedRecord.createdAt}
          />
        )}
      </div>
    </div>
  );
}
