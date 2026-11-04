import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { contact, experience, profile, resume } from "../src/content/profile";
import { featuredCaseStudies, projects } from "../src/content/projects";
import { caseStudySections, hangarFlow, homepage, navigation } from "../src/content/site";
import { hangarCaseStudy } from "../src/content/hangar-case-study";

test("navigation and project groups reference existing, unique content", () => {
  const sections = ["servicios", homepage.projects.id, homepage.about.id, homepage.contact.id];
  expect(new Set(sections).size).toBe(sections.length);
  for (const action of [...navigation.items, homepage.hero.primaryAction, homepage.hero.secondaryAction]) {
    expect(sections).toContain(action.sectionId);
  }
  const ids = projects.map((project) => project.id);
  expect(ids).toContain(hangarFlow.projectId);
  expect(new Set(ids).size).toBe(ids.length);
  const groups = [
    { ids: homepage.projects.featured.projectIds, kind: "case-study" },
    { ids: homepage.projects.engineering.projectIds, kind: "engineering-system" },
  ];
  const selected = groups.flatMap((group) => group.ids);
  expect(new Set(selected).size).toBe(selected.length);
  expect([...selected].sort()).toEqual([...ids].sort());
  for (const group of groups) {
    for (const id of group.ids) expect(projects.find((project) => project.id === id)?.kind).toBe(group.kind);
  }
  for (const project of featuredCaseStudies) {
    for (const section of caseStudySections) expect(project).toHaveProperty(section.field);
  }
});

test("filled claims retain source references and metrics require measurement evidence", () => {
  // This checks traceability, not whether a source proves the wording: that needs editorial review.
  function checkEvidence(value: unknown): void {
    if (!value || typeof value !== "object") return;
    for (const [key, entry] of Object.entries(value)) {
      if (key === "evidence" || key.endsWith("Evidence")) {
        expect(Array.isArray(entry)).toBe(true);
        expect(entry.length).toBeGreaterThan(0);
        for (const source of entry) {
          expect(source.source.trim()).not.toBe("");
          expect(source.location.trim()).not.toBe("");
          expect(["owner-statement", "document", "repository", "demo", "measurement"]).toContain(source.kind);
        }
      } else {
        checkEvidence(entry);
      }
    }
  }
  checkEvidence({ profile, experience, contact, resume, projects, hangarFlow, hangarCaseStudy });
  for (const project of featuredCaseStudies) {
    for (const result of project.results) {
      expect(result.description.trim()).not.toBe("");
      expect(result.evidence.some((source) => ["repository", "demo", "measurement"].includes(source.kind))).toBe(true);
      if (!result.metric) continue;
      expect(result.evidence.some((source) => source.kind === "measurement")).toBe(true);
      expect(Number.isFinite(result.metric.value)).toBe(true);
      for (const key of ["unit", "method", "conditions", "measuredAt"] as const) {
        expect(result.metric[key].trim()).not.toBe("");
      }
      expect(Number.isNaN(Date.parse(result.metric.measuredAt))).toBe(false);
    }
  }
});

test("ready projects have enough content to publish without empty narratives", () => {
  for (const project of projects.filter((project) => project.status !== "draft")) {
    expect(project.summary?.text.trim()).toBeTruthy();
    expect(project.stack.length).toBeGreaterThan(0);
    if (project.kind === "engineering-system") {
      expect(project.engineeringFocus?.text.trim()).toBeTruthy();
    } else if (project.status === "ready") {
      expect(project.contribution?.text.trim()).toBeTruthy();
      for (const field of ["context", "problem", "architecture", "operation"] as const) {
        expect(project[field]?.text.trim()).toBeTruthy();
      }
      expect(project.technicalDecisions.length).toBeGreaterThan(0);
    } else {
      expect(project.contribution?.text.trim()).toBeTruthy();
      expect(project.architecture?.text.trim()).toBeTruthy();
    }
  }
});

test("outbound links use explicit destinations and a downloadable CV exists before linking", () => {
  const links = [contact.email, ...contact.professionalLinks, ...projects.flatMap((project) => [project.repository, project.demo])];
  for (const link of links) {
    if (!link) continue;
    expect(link.label.trim()).not.toBe("");
    const url = new URL(link.href);
    expect(["https:", "mailto:"]).toContain(url.protocol);
    if (url.protocol === "mailto:") expect(url.pathname).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    else expect(url.hostname).toContain(".");
  }
  if (resume.file) {
    expect(resume.file.href).toMatch(/^\/[\w/-]+\.pdf$/);
    expect(existsSync(`public${resume.file.href}`)).toBe(true);
  }
});
