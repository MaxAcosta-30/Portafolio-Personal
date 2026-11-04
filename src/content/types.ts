/** Editorial data, independent of React. Missing evidence is null, never invented copy. */
export type Evidence = {
  source: string;
  location: string;
  kind: "owner-statement" | "document" | "repository" | "demo" | "measurement";
};

export type SupportedText = {
  text: string;
  evidence: readonly [Evidence, ...Evidence[]];
};

/** Source-backed address; evidence does not imply a live availability check. */
export type SourcedLink = {
  label: string;
  href: string;
  /** Repository visibility verified separately from source evidence. */
  visibility?: "public" | "private";
  evidence: readonly [Evidence, ...Evidence[]];
};

export type Technology = {
  name: string;
  usage: string;
  evidence: readonly [Evidence, ...Evidence[]];
};

export type TechnicalDecision = {
  decision: string;
  rationale: string;
  alternatives: readonly string[];
  tradeoffs: readonly string[];
  evidence: readonly [Evidence, ...Evidence[]];
};

export type ProvenResult = {
  description: string;
  evidence: readonly [Evidence, ...Evidence[]];
  /** A qualitative result needs no number. A number needs a reproducible measurement. */
  metric: {
    value: number;
    unit: string;
    method: string;
    conditions: string;
    measuredAt: string;
  } | null;
};

type ProjectBase = {
  id: string;
  name: string;
  /** Names previously supplied; not alternative claims about scope. */
  aliases: readonly string[];
  /** summary-ready permits a sourced preview, not a complete case-study page. */
  status: "draft" | "summary-ready" | "ready";
  nameEvidence: readonly [Evidence, ...Evidence[]];
  summary: SupportedText | null;
  contribution: SupportedText | null;
  stack: readonly Technology[];
  repository: SourcedLink | null;
  demo: SourcedLink | null;
};

export type FeaturedCaseStudy = ProjectBase & {
  kind: "case-study";
  context: SupportedText | null;
  problem: SupportedText | null;
  architecture: SupportedText | null;
  technicalDecisions: readonly TechnicalDecision[];
  operation: SupportedText | null;
  challenges: readonly SupportedText[];
  testing: SupportedText | null;
  security: SupportedText | null;
  infrastructure: SupportedText | null;
  results: readonly ProvenResult[];
};

export type EngineeringSystem = ProjectBase & {
  kind: "engineering-system";
  engineeringFocus: SupportedText | null;
};

export type Project = FeaturedCaseStudy | EngineeringSystem;
