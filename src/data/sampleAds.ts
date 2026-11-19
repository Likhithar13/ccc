import type { SampleAdvertisement } from "../types/analysis";

export const SAMPLE_ADVERTISEMENTS: SampleAdvertisement[] = [
  {
    id: "sample-fee-internship",
    label: "Sample 1: Upfront Registration Fee Internship",
    scenarioType: "Suspicious Paid Internship",
    expectedSignal: "Tests fee solicitation, WhatsApp-only recruitment, urgency pressure, and unrealistic pay",
    companyName: "Apex Global Tech Solutions (Fictional)",
    source: "WhatsApp Student Group Forward",
    advertisementText: `URGENT HIRING!! REMOTE SOFTWARE & DATA ENTRY INTERNSHIP — LIMITED 15 SEATS ONLY!!

Earn Rs. 35,000 to Rs. 50,000 per month working just 2 hours a day from your smartphone or laptop! No prior coding skills or interview required — 100% guaranteed selection for all college students and freshers!

Selected candidates receive an International Training Certificate + Stipend starting Week 1.

MANDATORY REGISTRATION STEP:
Due to heavy demand, applicants must pay a refundable Rs. 1,499 Security & Kit Registration Fee via UPI to verify their slot before 6:00 PM TODAY. Slots close tonight!

To apply immediately, send your Name, Aadhaar Card / PAN copy, Bank Account Number, and payment screenshot on WhatsApp to HR Manager Rahul at +91-98XXX-XXXXX or email apexglobal.hr.jobs2026@gmail.com.

No phone calls please. Act fast or your offer will be cancelled!`,
  },
  {
    id: "sample-incomplete-listing",
    label: "Sample 2: Incomplete Job Advertisement",
    scenarioType: "Insufficient Company Details",
    expectedSignal: "Tests missing corporate identity, vague responsibilities, generic contact, and unclear selection process",
    companyName: "",
    source: "Social Media Post",
    advertisementText: `Hiring Freshers Immediately — Work From Home Opportunity!

We are looking for smart and motivated graduates for an exciting Business & Operations Associate role. Good communication skills preferred. Freshers welcome.

Salary: Attractive package based on performance.
Location: Remote / Flexible hours.
Joining: Immediate.

Responsibilities include handling daily online tasks, coordinating with clients, and assisting team leads with various assignments.

Interested candidates send your resume to career.recruitdesk99@gmail.com with subject line "Fresher Application". Shortlisted applicants will be contacted directly for onboarding.`,
  },
  {
    id: "sample-standard-graduate",
    label: "Sample 3: Standard Graduate Recruitment Listing",
    scenarioType: "Standard Recruitment Process",
    expectedSignal: "Tests clear corporate identity, realistic compensation, transparent duties, and multi-stage interview process",
    companyName: "Northbridge Cloud Systems Pvt. Ltd. (Fictional)",
    source: "University Career Placement Portal",
    advertisementText: `Junior Software Engineer — Graduate Campus Hiring (2026 Cohort)
Company: Northbridge Cloud Systems Pvt. Ltd.
Website: https://northbridgecloud.example.com
Office Location: Bengaluru, Karnataka (Hybrid — 3 days/week in office)
Compensation: INR 6.5 LPA – 7.5 LPA CTC (Fixed + Standard Benefits, detailed in offer letter)

Role Overview:
We are inviting applications from final-year B.Tech / B.E. / MCA students graduating in 2026 to join our Platform Engineering team. You will collaborate with senior engineers on backend REST APIs, automated integration tests, and cloud deployment pipelines.

Minimum Qualifications:
- Strong fundamentals in Data Structures, Algorithms, and OOP (Java, TypeScript, or Python).
- Familiarity with relational databases (PostgreSQL) and Git version control.
- Academic project or internship experience in web application development.

Selection Process (No Fees Charged at Any Stage):
1. Application screening via our official careers portal (careers.northbridgecloud.example.com) or your college placement cell.
2. Online technical assessment (60 minutes covering coding and SQL).
3. Two structured technical interviews + one engineering manager conversation.

Note: Northbridge Cloud Systems never charges any registration, training, or equipment deposit fee during recruitment. Official communication is sent exclusively from @northbridgecloud.example.com email addresses.`,
  },
];
