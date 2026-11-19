import "dotenv/config";
import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = "gemini-3.1-flash-lite";

interface AnalyzeRequestBody {
  advertisementText?: unknown;
  companyName?: unknown;
  source?: unknown;
}

const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskClassification: {
      type: Type.STRING,
      description:
        "Must be exactly one of: LOW, MEDIUM, HIGH, or INSUFFICIENT INFORMATION. Use INSUFFICIENT INFORMATION when the posting is too vague or lacks verifiable corporate/role details to reliably judge legitimacy or fraud.",
    },
    indicativeRiskScore: {
      type: Type.INTEGER,
      description:
        "Indicative heuristic score from 0 to 100 (higher means stronger presence of suspicious indicators; NOT a statistically validated probability).",
    },
    explanation: {
      type: Type.STRING,
      description:
        "Clear, objective 2-4 sentence summary for a college student explaining why this rating was assigned without claiming certainty or declaring an employer legally fraudulent.",
    },
    checkedCriteria: {
      type: Type.ARRAY,
      description:
        "Evaluation across all 9 required fraud-detection criteria.",
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING },
          status: {
            type: Type.STRING,
            description: "Must be one of: FLAGGED, CLEAR, or NOT_MENTIONED.",
          },
          note: { type: Type.STRING },
        },
        required: ["criterion", "status", "note"],
      },
    },
    warningSigns: {
      type: Type.ARRAY,
      description:
        "Specific suspicious indicators discovered in the advertisement, each backed by verbatim evidence from the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            description: "Must be one of: LOW, MEDIUM, HIGH.",
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          evidenceQuote: {
            type: Type.STRING,
            description:
              "Exact short quote or phrase copied from the submitted advertisement supporting this warning sign.",
          },
        },
        required: [
          "category",
          "severity",
          "title",
          "description",
          "evidenceQuote",
        ],
      },
    },
    positiveIndicators: {
      type: Type.ARRAY,
      description:
        "Reassuring or standard professional recruitment signals found in the posting, if any.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          detail: { type: Type.STRING },
        },
        required: ["title", "detail"],
      },
    },
    missingInformation: {
      type: Type.ARRAY,
      description:
        "Important employer, role, or process details absent from the advertisement.",
      items: { type: Type.STRING },
    },
    recommendedVerificationSteps: {
      type: Type.ARRAY,
      description:
        "Practical, actionable steps a student or graduate should take to verify the opportunity independently.",
      items: { type: Type.STRING },
    },
  },
  required: [
    "riskClassification",
    "indicativeRiskScore",
    "explanation",
    "checkedCriteria",
    "warningSigns",
    "positiveIndicators",
    "missingInformation",
    "recommendedVerificationSteps",
  ],
};

const SYSTEM_INSTRUCTION = `You are JobShield AI, an analytical assistant helping college students and fresh graduates evaluate job and internship advertisements for recruitment fraud indicators.

Inspect the advertisement across these 9 criteria:
1. Registration, training, security, or application fees
2. Unrealistic salary or stipend promises
3. Suspicious recruitment language (e.g., guaranteed selection, no skills needed)
4. Pressure tactics and artificial urgency
5. Missing or unverifiable company information
6. Unprofessional communication (free webmail domains, WhatsApp-only screening)
7. Requests for sensitive personal or financial information (IDs, bank account, UPI, OTP)
8. Unclear or vague job responsibilities
9. Unusual selection procedures (no interview, instant offer)

Rules:
- Be concise and objective. Keep checkedCriteria notes under 15 words each, warning sign descriptions under 25 words, and explanation to 2-3 sentences.
- Never claim an employer is legally fraudulent based solely on text analysis, and never present indicativeRiskScore (0-100) as a statistically validated probability.
- Use "INSUFFICIENT INFORMATION" when core employer and role details are too sparse to judge reliably.
- Populate checkedCriteria with all 9 criteria above.
- Include an exact verbatim evidenceQuote from the text for each warning sign.
- Output valid JSON matching the schema.`;

function getConfiguredApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  return key;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatusCode(error: unknown): number {
  if (typeof error === "object" && error !== null) {
    const errObj = error as { status?: unknown; statusCode?: unknown; code?: unknown };
    if (typeof errObj.status === "number") return errObj.status;
    if (typeof errObj.statusCode === "number") return errObj.statusCode;
    if (typeof errObj.code === "number") return errObj.code;
  }
  return 500;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred while communicating with Gemini AI.";
}

async function generateAnalysisWithRetry(
  ai: GoogleGenAI,
  userPrompt: string
): Promise<string> {
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startedAt = Date.now();
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_RESPONSE_SCHEMA,
          abortSignal: AbortSignal.timeout(25000),
        },
      });

      const text = response.text?.trim();
      console.log(
        `[JobShield AI] Gemini responded in ${Date.now() - startedAt}ms (attempt ${attempt})`
      );
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    } catch (error) {
      lastError = error;
      const status = getErrorStatusCode(error);
      const message = getErrorMessage(error);
      console.warn(
        `[JobShield AI] Gemini attempt ${attempt} failed after ${Date.now() - startedAt}ms:`,
        status,
        message
      );
      const isNonRetryable =
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404 ||
        status === 429 ||
        message.includes("AbortError") ||
        message.includes("TimeoutError") ||
        message.includes("aborted") ||
        message.includes("API_KEY_INVALID") ||
        message.includes("PERMISSION_DENIED") ||
        message.includes("RESOURCE_EXHAUSTED");

      if (isNonRetryable || attempt === maxAttempts) {
        throw error;
      }

      await sleep(500);
    }
  }

  throw lastError;
}

function normalizeRiskClassification(
  value: unknown
): "LOW" | "MEDIUM" | "HIGH" | "INSUFFICIENT INFORMATION" {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized === "LOW") return "LOW";
  if (normalized === "MEDIUM") return "MEDIUM";
  if (normalized === "HIGH") return "HIGH";
  if (normalized === "INSUFFICIENT INFORMATION") return "INSUFFICIENT INFORMATION";
  return "INSUFFICIENT INFORMATION";
}

function normalizeScore(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeCriterionStatus(
  value: unknown
): "FLAGGED" | "CLEAR" | "NOT_MENTIONED" {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized === "FLAGGED") return "FLAGGED";
  if (normalized === "CLEAR") return "CLEAR";
  return "NOT_MENTIONED";
}

function normalizeSeverity(value: unknown): "LOW" | "MEDIUM" | "HIGH" {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized === "HIGH") return "HIGH";
  if (normalized === "MEDIUM") return "MEDIUM";
  return "LOW";
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    const apiKey = getConfiguredApiKey();
    res.json({
      status: "ok",
      geminiConfigured: Boolean(apiKey),
      model: GEMINI_MODEL,
    });
  });

  app.post("/api/analyze", async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as AnalyzeRequestBody;

    if (typeof body.advertisementText !== "string") {
      res.status(400).json({
        error: "Advertisement text is required and must be a string.",
      });
      return;
    }

    const advertisementText = body.advertisementText.trim();
    if (advertisementText.length < 25) {
      res.status(400).json({
        error:
          "Please provide at least 25 characters of the job or internship advertisement for meaningful analysis.",
      });
      return;
    }

    if (advertisementText.length > 15000) {
      res.status(400).json({
        error:
          "Advertisement text exceeds the maximum limit of 15,000 characters.",
      });
      return;
    }

    const companyName =
      typeof body.companyName === "string"
        ? body.companyName.trim().slice(0, 150)
        : "";
    const source =
      typeof body.source === "string" ? body.source.trim().slice(0, 150) : "";

    const apiKey = getConfiguredApiKey();
    if (!apiKey) {
      res.status(503).json({
        error:
          "Gemini API key is not configured on the server. Please set GEMINI_API_KEY in the Settings > Secrets panel and try again.",
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const userPrompt = [
      `Company Name Provided by User: ${companyName || "Not provided"}`,
      `Advertisement Source Provided by User: ${source || "Not provided"}`,
      "",
      "Submitted Job / Internship Advertisement Text:",
      "--- BEGIN ADVERTISEMENT ---",
      advertisementText,
      "--- END ADVERTISEMENT ---",
    ].join("\n");

    try {
      const rawJson = await generateAnalysisWithRetry(ai, userPrompt);
      const parsed = JSON.parse(rawJson) as Record<string, unknown>;

      const checkedCriteria = Array.isArray(parsed.checkedCriteria)
        ? parsed.checkedCriteria.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>;
            return {
              criterion: String(entry.criterion ?? "Risk Criterion"),
              status: normalizeCriterionStatus(entry.status),
              note: String(entry.note ?? ""),
            };
          })
        : [];

      const warningSigns = Array.isArray(parsed.warningSigns)
        ? parsed.warningSigns.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>;
            return {
              category: String(entry.category ?? "General Risk"),
              severity: normalizeSeverity(entry.severity),
              title: String(entry.title ?? "Warning Sign"),
              description: String(entry.description ?? ""),
              evidenceQuote: String(entry.evidenceQuote ?? ""),
            };
          })
        : [];

      const positiveIndicators = Array.isArray(parsed.positiveIndicators)
        ? parsed.positiveIndicators.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>;
            return {
              title: String(entry.title ?? "Positive Signal"),
              detail: String(entry.detail ?? ""),
            };
          })
        : [];

      const missingInformation = Array.isArray(parsed.missingInformation)
        ? parsed.missingInformation.map((item) => String(item))
        : [];

      const recommendedVerificationSteps = Array.isArray(
        parsed.recommendedVerificationSteps
      )
        ? parsed.recommendedVerificationSteps.map((item) => String(item))
        : [];

      res.json({
        report: {
          riskClassification: normalizeRiskClassification(
            parsed.riskClassification
          ),
          indicativeRiskScore: normalizeScore(parsed.indicativeRiskScore),
          explanation: String(
            parsed.explanation ?? "Analysis completed successfully."
          ),
          checkedCriteria,
          warningSigns,
          positiveIndicators,
          missingInformation,
          recommendedVerificationSteps,
        },
        analysedAt: new Date().toISOString(),
        model: GEMINI_MODEL,
      });
    } catch (error) {
      const status = getErrorStatusCode(error);
      const message = getErrorMessage(error);
      console.error("[JobShield AI] Gemini analysis error:", status, message);

      if (
        status === 403 ||
        message.includes("PERMISSION_DENIED") ||
        message.includes("API_KEY_INVALID")
      ) {
        res.status(403).json({
          error:
            "Gemini API authentication failed. Please verify GEMINI_API_KEY in the Settings > Secrets panel.",
        });
        return;
      }

      if (status === 429 || message.includes("RESOURCE_EXHAUSTED")) {
        res.status(429).json({
          error:
            "Gemini API rate limit or quota was exceeded. Please wait a moment before trying again or check your API quota in Settings > Secrets.",
        });
        return;
      }

      if (status === 404 || message.includes("NOT_FOUND")) {
        res.status(502).json({
          error: `Requested Gemini model (${GEMINI_MODEL}) was unavailable. Please verify model availability.`,
        });
        return;
      }

      if (
        message.includes("TimeoutError") ||
        message.includes("AbortError") ||
        message.includes("aborted")
      ) {
        res.status(504).json({
          error:
            "The AI analysis request timed out while waiting for Gemini. Please try again.",
        });
        return;
      }

      res.status(502).json({
        error: `Analysis failed due to an upstream Gemini API error: ${message}`,
      });
    }
  });

  const isProduction = process.env.NODE_ENV === "production";
  const distDir = path.resolve(__dirname, "dist");

  if (!isProduction || !fs.existsSync(distDir)) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get("/{*path}", (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JobShield AI server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error("Failed to start JobShield AI server:", err);
  process.exit(1);
});
