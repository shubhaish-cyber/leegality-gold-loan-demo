/**
 * Leegality workflow configs per language.
 *
 * Source of truth: the "Run Workflow → Via API" payload JSONs downloaded
 * from the Leegality dashboard (one per language). Each language has its
 * own profileId AND its own template field IDs — field IDs are generated
 * per template and are NOT reusable across templates.
 *
 * Field names differ per language too:
 *   - English template uses "Jewel 1/2/3"
 *   - All other languages use "Gold 1/2/3"
 *
 * When a user picks a language at the start of the flow, the Valuation
 * Certificate eSign request must be sent to the matching workflow.
 *
 * Fallback behavior: `getValuationWorkflow(lang)` returns the English
 * config if the lang code isn't found in this map.
 */
export const VALUATION_WORKFLOWS_BY_LANG = {
  en: {
    profileId: "dfHluVS",
    fields: [
      { id: "1776920742364", name: "Jewel 1",          type: "file", value: "" },
      { id: "1776920789572", name: "Jewel 2",          type: "file", value: "" },
      { id: "1776920816374", name: "Jewel 3",          type: "file", value: "" },
      { id: "1776920862444", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  hi: {
    profileId: "vUAtR2Q",
    fields: [
      { id: "1776920984127", name: "Gold 1",           type: "file", value: "" },
      { id: "1776920997571", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921012043", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921059168", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  bn: {
    profileId: "aSUPLoc",
    fields: [
      { id: "1776921104192", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921117572", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921130311", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921146103", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  or: {
    profileId: "FDNUlIm",
    fields: [
      { id: "1776921187364", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921200646", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921218266", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921235119", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  gu: {
    profileId: "EistHke",
    fields: [
      { id: "1776921299768", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921309619", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921320409", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921335389", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  mr: {
    profileId: "c6hDOke",
    fields: [
      { id: "1776921382737", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921396005", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921408039", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921426120", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  kn: {
    profileId: "xSPtjSK",
    fields: [
      { id: "1776921467469", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921482666", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921496931", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921518438", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  ml: {
    profileId: "dAkrPbs",
    fields: [
      { id: "1776921565747", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921578454", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921589952", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921606372", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  te: {
    profileId: "xDkSF7Q",
    fields: [
      { id: "1776921653929", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921666974", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921679292", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921694699", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  pa: {
    profileId: "2BGW7fC",
    // Punjabi template reuses the same field IDs as Hindi (per downloaded JSON).
    fields: [
      { id: "1776920984127", name: "Gold 1",           type: "file", value: "" },
      { id: "1776920997571", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921012043", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921059168", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
  ta: {
    profileId: "7MjHumw",
    fields: [
      { id: "1776921746509", name: "Gold 1",           type: "file", value: "" },
      { id: "1776921756558", name: "Gold 2",           type: "file", value: "" },
      { id: "1776921766982", name: "Gold 3",           type: "file", value: "" },
      { id: "1776921779947", name: "Customer + Gold",  type: "file", value: "" },
    ],
  },
};

export function getValuationWorkflow(lang) {
  return VALUATION_WORKFLOWS_BY_LANG[lang] || VALUATION_WORKFLOWS_BY_LANG.en;
}
