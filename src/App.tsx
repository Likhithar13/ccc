import { useState } from "react";
import { AnalyserPage } from "./components/AnalyserPage";
import { DashboardPage } from "./components/DashboardPage";
import { DocumentationPage } from "./components/DocumentationPage";
import { HomePage } from "./components/HomePage";
import { type AppPage, Navbar } from "./components/Navbar";
import type { SessionAnalysisRecord } from "./types/analysis";

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>("home");
  const [sessionRecords, setSessionRecords] = useState<SessionAnalysisRecord[]>(
    []
  );
  const [activeRecord, setActiveRecord] =
    useState<SessionAnalysisRecord | null>(null);
  const [highlightSamples, setHighlightSamples] = useState(false);

  const handleNavigate = (page: AppPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLaunchSample = () => {
    setHighlightSamples(true);
    setActivePage("analyser");
  };

  const handleAnalysisComplete = (record: SessionAnalysisRecord) => {
    setSessionRecords((prev) => [record, ...prev]);
    setActiveRecord(record);
  };

  const handleViewRecord = (record: SessionAnalysisRecord) => {
    setActiveRecord(record);
    setActivePage("analyser");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearRecords = () => {
    setSessionRecords([]);
    setActiveRecord(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0B162C]">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activePage === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            onLaunchSample={handleLaunchSample}
          />
        )}

        {activePage === "analyser" && (
          <AnalyserPage
            activeRecord={activeRecord}
            highlightSamplesOnMount={highlightSamples}
            onConsumeSampleHighlight={() => setHighlightSamples(false)}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {activePage === "dashboard" && (
          <DashboardPage
            records={sessionRecords}
            onViewRecord={handleViewRecord}
            onClearRecords={handleClearRecords}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === "documentation" && <DocumentationPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-[#0B162C]">
              JobShield AI
            </span>
            <span aria-hidden="true">·</span>
            <span>
              AI-Based Fake Job &amp; Internship Detection System for Students
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate("analyser")}
              className="hover:text-[#0B162C] transition-colors"
            >
              Analyser
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("dashboard")}
              className="hover:text-[#0B162C] transition-colors"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("documentation")}
              className="hover:text-[#0B162C] transition-colors"
            >
              Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
