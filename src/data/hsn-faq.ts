import type { Faq } from "@/lib/posts";

// Shown on the HSN code finder page and marked up as its FAQ.
export const HSN_FAQ: Faq[] = [
  {
    q: "What is the HSN code for LT panels?",
    a: "85371000. India has one 8-digit line for boards and panels for 1000 V or less, covering PCC, MCC, APFC, ATS and PLC panels.",
  },
  {
    q: "What is the HSN code for MV switchgear and RMUs?",
    a: "85372000, the line for boards and panels for more than 1000 V, including complete ring main units.",
  },
  {
    q: "What is the HSN code for a transformer above 10 MVA?",
    a: "85042310 for 10 to 50 MVA, 85042320 for 50 to 100 MVA, 85042330 for 100 to 250 MVA and 85042340 above 250 MVA.",
  },
  {
    q: "Is 85371090 a valid HSN code?",
    a: "No. The Indian tariff does not split 853710, so the only valid 8-digit line is 85371000.",
  },
  {
    q: "Will my import code match the Indian HSN code?",
    a: "The first six digits match worldwide. The last digits are national, so your customs broker adds your country's own suffix.",
  },
];
