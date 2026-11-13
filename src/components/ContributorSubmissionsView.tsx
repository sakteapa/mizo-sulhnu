import React from "react";
import type { SubmissionRecord } from "../types/book";
import { SeverityTag, SubmissionStatusTag } from "./SeverityAndStatusTag";

interface ContributorSubmissionsViewProps {
  contributorName: string;
  submissions: SubmissionRecord[];
}

export const ContributorSubmissionsView: React.FC<
  ContributorSubmissionsViewProps
> = ({ contributorName, submissions }) => {
  const mine = submissions.filter(
    (s) => s.submittedByRole === "contributor"
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <div className="pb-6 border-b border-[var(--border-hairline)]">
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
          Contributor / Mimal · {contributorName}
        </p>
        <h1 className="mt-1.5 font-display text-3xl font-semibold text-[var(--text-ink)]">
          Ka Thil Thawn Te (Submission Status)
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Lehkhabu bung siamthat, DNA record thar, leh thlalak/document i thawn zawng zawngte dinhmun enna.
        </p>
      </div>

      {mine.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border-hairline)] rounded-md text-center space-y-2">
          <p className="font-display text-xl text-[var(--text-ink)]">
            Thil thawn chhinchhiah a la awm rih lo
          </p>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            &ldquo;Data &amp; Thlalak Upload&rdquo; emaw &ldquo;DNA Chain &amp; Chhuizuina&rdquo; emaw &ldquo;Lehkhabu Ziahna&rdquo; aṭangin thuziak leh record han thawn chhin rawh.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mine.map((sub) => (
            <article
              key={sub.id}
              className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-lg font-semibold text-[var(--text-ink)]">
                    {sub.sourceName}
                  </h2>
                  <SeverityTag severity={sub.overallSeverity} />
                </div>
                <SubmissionStatusTag status={sub.status} />
              </div>

              <p className="text-xs text-[var(--text-muted)] tabular-nums">
                {new Date(sub.submittedAt).toLocaleString()} · Type:{" "}
                {sub.submissionType}
              </p>

              <p className="font-book text-sm text-[var(--text-ink)]">
                {sub.auditReportMizoEnglish}
              </p>

              {sub.adminNotes && (
                <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded text-xs">
                  <span className="font-semibold text-[var(--accent-ink)]">
                    Admin Note:{" "}
                  </span>
                  <span className="text-[var(--text-ink)]">{sub.adminNotes}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
