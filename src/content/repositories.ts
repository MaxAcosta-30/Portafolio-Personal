import type { Evidence, SourcedLink } from "./types";

/** Public repositories inspected on 2026-10-28. Pin evidence; keep the code link current. */
export const repositories = {
  hangar: { name: "Setup-hangar", revision: "62f02735668eb66e65a06041eb4277525399f174" },
  "taskflow-pro": { name: "Taskflow-pro", revision: "9b8a54b9c89a8f7d1b7e8ddc29e6d47a347c1c79" },
  "secure-vault": { name: "SecureVault", revision: "9a581cc3aab1f8f21e010e4d9c3ee1c2ec4c8f13" },
  safeledger: { name: "SafeLedger-API", revision: "c37ac10c5052566cca14555c80bb8badec1f4a10" },
  fortressid: { name: "FortressID", revision: "bdf424c1f5a78ecebf90d317bd2fae29a4b014b7" },
  "secure-inventory": { name: "SecureInventory-API", revision: "5f65e5d5886194a5f692560f620ec3e2c1a84ab4" },
  "sentinel-iot": { name: "SentinelIoT", revision: "92136c07789420ff52bdf8c42ae1dabce5308dca" },
  "freelanceguard-erp": { name: "FreelanceGuard-ERP", revision: "1ffc876f20fe980f3be094e0a9efc0fa5deabda8" },
} as const;

export function repositoryEvidence(id: keyof typeof repositories, path = "README.md"): Evidence {
  const { name, revision } = repositories[id];
  return {
    source: `https://github.com/MaxAcosta-30/${name}/blob/${revision}/${path}`,
    location: `${path} · revisión del 28 de octubre de 2026`,
    kind: "repository",
  };
}

export function repositoryLink(id: keyof typeof repositories): SourcedLink {
  return {
    label: "Ver repositorio",
    // Public visibility rechecked through GitHub on 2026-10-29.
    visibility: "public",
    href: `https://github.com/MaxAcosta-30/${repositories[id].name}`,
    evidence: [repositoryEvidence(id)],
  };
}
