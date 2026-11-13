import React, { useState } from "react";
import { BookOpen, Shield, UserCheck, X } from "lucide-react";
import type { UserRole } from "../types/book";

interface RolePortalModalProps {
  currentRole: UserRole;
  contributorName: string;
  onSelectRole: (role: UserRole, contributorName?: string) => void;
  onClose: () => void;
}

export const RolePortalModal: React.FC<RolePortalModalProps> = ({
  currentRole,
  contributorName,
  onSelectRole,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(contributorName);

  const roles: Array<{
    id: UserRole;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "admin",
      title: "Admin (Enkawltu Ber)",
      subtitle: "Full Access & Moderation Authority",
      description:
        "Full access to Master Database, Book Publishing, AI Alert Inbox, Approve/Reject/Edit/Rollback user submissions, and Reader privacy controls.",
      icon: <Shield className="w-5 h-5 text-[var(--accent-ink)]" />,
    },
    {
      id: "contributor",
      title: "Contributor / Mimal",
      subtitle: "Data & Story Uploader (AI Watchdog Audited)",
      description:
        "Write/revise chapters, submit family trees, and upload documents/images. Every submission is audited by the AI Integrity Watchdog; discrepancies escalate to Admin.",
      icon: <UserCheck className="w-5 h-5 text-[var(--accent-ink)]" />,
    },
    {
      id: "reader",
      title: "Reader / Chhiartu",
      subtitle: "Public Explorer (Read-Only)",
      description:
        "Read-only access to published book chapters and the Bi-Directional DNA Chain Explorer. Private medical and blood group records remain masked unless unlocked by Admin.",
      icon: <BookOpen className="w-5 h-5 text-[var(--accent-ink)]" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Role Switcher Portal"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 sm:p-8 rounded-md shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Role-Based Access Control (RBAC)
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-ink)]">
              Zofate Studio — Role Login Portal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close portal"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="contributor-name-input"
            className="block text-xs font-medium text-[var(--text-muted)]"
          >
            Contributor / User Hming (for Submission Audit Trail)
          </label>
          <input
            id="contributor-name-input"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Mimal Hming (e.g. Lalramnghaka)"
            className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
          />
        </div>

        <div className="space-y-3">
          {roles.map((r) => {
            const active = r.id === currentRole;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelectRole(r.id, nameInput.trim() || "Mimal Contributor");
                  onClose();
                }}
                className={`w-full text-left p-4 border rounded-md transition-colors flex items-start gap-4 ${
                  active
                    ? "border-[var(--accent-ink)] bg-[var(--accent-subtle)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--text-muted)]"
                }`}
              >
                <div className="pt-0.5 shrink-0">{r.icon}</div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-lg font-semibold text-[var(--text-ink)]">
                      {r.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      · {r.subtitle}
                    </span>
                    {active && (
                      <span className="font-code text-[11px] font-semibold text-[var(--accent-ink)]">
                        [Active]
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                    {r.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
