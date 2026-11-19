export type RiskClassification =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "INSUFFICIENT INFORMATION";

export type CriterionStatus = "FLAGGED" | "CLEAR" | "NOT_MENTIONED";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH";

export interface WarningSign {
  category: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  evidenceQuote: string;
}

export interface PositiveIndicator {
  title: string;
  detail: string;
}

export interface CheckedCriterion {
  criterion: string;
  status: CriterionStatus;
  note: string;
}

export interface AnalysisReport {
  riskClassification: RiskClassification;
  indicativeRiskScore: number;
  explanation: string;
  warningSigns: WarningSign[];
  positiveIndicators: PositiveIndicator[];
  missingInformation: string[];
  recommendedVerificationSteps: string[];
  checkedCriteria: CheckedCriterion[];
}

export interface SessionAnalysisRecord {
  id: string;
  createdAt: string;
  companyName: string;
  source: string;
  advertisementSnippet: string;
  advertisementText: string;
  report: AnalysisReport;
}

export interface AnalyzeRequestPayload {
  advertisementText: string;
  companyName?: string;
  source?: string;
}

export interface AnalyzeApiResponse {
  report: AnalysisReport;
  analysedAt: string;
  model: string;
}

export interface SampleAdvertisement {
  id: string;
  label: string;
  scenarioType: string;
  expectedSignal: string;
  companyName: string;
  source: string;
  advertisementText: string;
}
