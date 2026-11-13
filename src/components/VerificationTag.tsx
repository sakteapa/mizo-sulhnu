import React from "react";
import type { VerificationStatus } from "../types/book";

interface VerificationTagProps {
  status: VerificationStatus;
}

export const VerificationTag: React.FC<VerificationTagProps> = ({ status }) => {
  if (status === "verified_history") {
    return (
      <span className="font-code text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
        [Verified History]
      </span>
    );
  }
  if (status === "verified_colonial") {
    return (
      <span className="font-code text-[11px] font-medium text-sky-700 dark:text-sky-400">
        [Verified Colonial Record]
      </span>
    );
  }
  if (status === "oral_tradition") {
    return (
      <span className="font-code text-[11px] font-medium text-amber-700 dark:text-amber-400">
        [Oral Tradition / Thawnthu]
      </span>
    );
  }
  return (
    <span className="font-code text-[11px] font-medium text-rose-700 dark:text-rose-400">
      [Needs Review / Thu Inkalh]
    </span>
  );
};
