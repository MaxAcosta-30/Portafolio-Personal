import type { Evidence, SupportedText, SourcedLink } from "./types";
import { cvEvidence, supported } from "./evidence";

const summarySource = cvEvidence("Página 1 · Resumen");
const educationSource = cvEvidence("Página 2 · Educación");
const contactSource = cvEvidence("Página 1 · Cabecera");
const outlierSource = cvEvidence("Página 2 · Entrenador de Inteligencia Artificial (Remoto), Outlier");

export const ownerBrief = {
  source: "Instrucciones del propietario del portafolio",
  location: "Prompt 1: Contexto principal, Proyectos prioritarios y experiencia en Outlier",
  kind: "owner-statement",
} as const satisfies Evidence;

export const profile = {
  /** Nombre legal completo: solo para el aviso legal, el de privacidad y los datos estructurados. */
  name: "Max Alexander Acosta Valencia",
  /** Nombre que se muestra: pestaña del navegador, redes, pie y marca (decisión de Max). */
  displayName: "Max Acosta",
  role: "Desarrollador de Software",
  education: {
    program: "Ingeniería en Sistemas Computacionales",
    status: "Estudiante",
    institution: "Tecnológico Nacional de México, campus Culiacán",
    dates: "Egreso estimado 2029",
    evidence: [educationSource],
  },
  priorEducation: {
    qualification: "Técnico en Programación",
    institution: "Centro de Bachillerato Tecnológico Industrial y de Servicios #224",
    year: 2024,
    evidence: [educationSource],
  },
  identityEvidence: [ownerBrief, contactSource],
  focus: {
    text: "Backend, APIs y sistemas en tiempo real.",
    evidence: [summarySource],
  } satisfies SupportedText,
  introduction: {
    text: "Soy estudiante de Ingeniería en Sistemas Computacionales y desarrollador Full Stack. Mi experiencia práctica incluye aplicaciones web, APIs y sistemas en tiempo real, con atención a la arquitectura, la seguridad y las pruebas.",
    evidence: [summarySource, cvEvidence("Página 1 · Hangar y TaskFlow Pro: pruebas y controles de seguridad")],
  } satisfies SupportedText,
  about: {
    title: "Sobre mí",
    paragraphs: [
      {
        text: "Mi trabajo abarca desarrollo Full Stack, con un foco técnico en backend, APIs e integración de sistemas.",
        evidence: [summarySource],
      },
      {
        text: "Mi formación en Ingeniería en Sistemas Computacionales se complementa con experiencia práctica en arquitectura, seguridad, sistemas en tiempo real y testing.",
        evidence: [summarySource, educationSource, cvEvidence("Página 2 · Habilidades: Testing")],
      },
    ] satisfies readonly SupportedText[],
  },
  /** Do not turn this general background into a stack for any particular project. */
  technicalBackground: {
    evidence: [cvEvidence("Página 2 · Habilidades"), summarySource],
    groups: [
      { label: "Desarrollo", items: [".NET / ASP.NET Core", "Go", "Node.js / TypeScript", "Next.js"] },
      { label: "Sistemas e integración", items: ["APIs", "Sistemas en tiempo real", "gRPC", "Temporal.io"] },
      { label: "Seguridad", items: ["Seguridad de aplicaciones", "OAuth", "OpenID Connect"] },
      { label: "Datos, operación y calidad", items: ["Bases de datos", "Redis", "Docker", "Observabilidad", "Testing", "Clean Architecture"] },
    ],
  },
};

export const experience: readonly {
  organization: string;
  status: "draft" | "ready";
  role: string | null;
  dates: string | null;
  description: SupportedText | null;
  evidence: readonly Evidence[];
}[] = [
  {
    organization: "Outlier",
    status: "ready",
    role: "Entrenador de Inteligencia Artificial (remoto)",
    dates: "Mayo 2025 – julio 2025",
    description: supported("Evalué y comparé respuestas de modelos de IA, redacté y optimicé prompts y generé y validé datasets de audio y texto.", outlierSource),
    evidence: [outlierSource],
  },
];

export const contact: {
  title: string;
  invitation: string;
  email: SourcedLink | null;
  professionalLinks: readonly SourcedLink[];
} = {
  title: "Contacto",
  invitation: "¿Tienes un proyecto o una oportunidad de desarrollo? Hablemos.",
  email: {
    label: "maxacostado3020@gmail.com",
    href: "mailto:maxacostado3020@gmail.com",
    evidence: [contactSource],
  },
  professionalLinks: [
    { label: "GitHub", href: "https://github.com/MaxAcosta-30", evidence: [contactSource] },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/max-acosta-240abb352", evidence: [contactSource] },
  ],
};

export const resume: {
  label: string;
  file: SourcedLink | null;
} = {
  label: "Descargar CV",
  file: null,
};
