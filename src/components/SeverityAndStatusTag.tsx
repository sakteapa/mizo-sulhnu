import React from "react";
import type { IntegritySeverity, SubmissionStatus } from "../types/book";

export const SeverityTag: React.FC<{ severity: IntegritySeverity }> = ({
  severity,
}) => {
  if (severity === "high_risk") {
    return (
      <span className="font-code text-[11px] font-semibold text-rose-700 dark:text-rose-400">
        [High Risk / Thu Inkalh Lian]
      </span>
    );
  }
  if (severity === "minor_discrepancy") {
    return (
      <span className="font-code text-[11px] font-semibold text-amber-700 dark:text-amber-400">
        [Minor Discrepancy / Enmil Ngai]
      </span>
    );
  }
  return (
    <span className="font-code text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
      [Clean / Record Dik]
    </span>
  );
};

export const SubmissionStatusTag: React.FC<{ status: SubmissionStatus }> = ({
  status,
}) => {
  if (status === "approved") {
    return (
      <span className="font-code text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
        [Pawm Tawh / Approved]
      </span>
    );
  }
  if (status === "flagged_to_admin") {
    return (
      <span className="font-code text-[11px] font-semibold text-amber-700 dark:text-amber-400">
        [Admin Enmek / Flagged to Admin]
      </span>
    );
  }
  return (
    <span className="font-code text-[11px] font-semibold text-rose-700 dark:text-rose-400">
      [Siamthat Ngai / Rejected]
    </span>
  );
};
