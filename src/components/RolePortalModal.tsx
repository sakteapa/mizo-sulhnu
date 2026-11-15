import React, { useState } from "react";
import { BookOpen, Shield, UserCheck, X, PhoneCall, CheckCircle2 } from "lucide-react";
import type { UserRole } from "../types/book";

interface RolePortalModalProps {
  currentRole: UserRole;
  contributorName: string;
  isContributorAuthenticated?: boolean;
  onSelectRole: (role: UserRole, contributorName?: string) => void;
  onRequestContributorAuth?: () => void;
  onClose: () => void;
}

export const RolePortalModal: React.FC<RolePortalModalProps> = ({
  currentRole,
  contributorName,
  isContributorAuthenticated = false,
  onSelectRole,
  onRequestContributorAuth,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(contributorName);

  const roles: Array<{
    id: UserRole;
    title: string;
    subtitle: string;
    description: string;
    requiresAuth?: boolean;
    icon: React.ReactNode;
  }> = [
    {
      id: "reader",
      title: "Reader / Chhiartu",
      subtitle: "Login A Ngai Lo (Zalen Taka Chhiarna)",
      description:
        "Bung 1–10 thuziak, Pi-pu thawnthu hlui, DNA Genealogy Chain, Bestiary Codex, leh Milem Gallery te hi login kher lovin zalen takin chhiar theih vek a ni.",
      requiresAuth: false,
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: "contributor",
      title: "Contributor / Mimal",
      subtitle: isContributorAuthenticated
        ? "Verified Contributor (Firebase)"
        : "Firebase Phone Authentication Ngai",
      description:
        "Lehkhabu bung siamthat, DNA thlahtu thar ziah belh, leh thlalak/document upload-na. Integrity vawn nan Firebase Phone SMS OTP hmanga in-verify a ngai.",
      requiresAuth: !isContributorAuthenticated,
      icon: <UserCheck className="w-5 h-5 text-[var(--accent-ink)]" />,
    },
    {
      id: "admin",
      title: "Admin (Enkawltu Ber)",
      subtitle: "Full Access & Moderation Authority",
      description:
        "Master Database enkawlna, AI Watchdog Alerts check-na, Contributor thil thawn approve/reject/rollback leh Reader privacy lock thununna.",
      requiresAuth: false,
      icon: <Shield className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Role Switcher Portal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Role-Based Access Control (RBAC)
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--text-ink)]">
              Zofate Studio — Role Thlanna
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close portal"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)] rounded-lg hover:bg-[var(--bg-canvas)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs text-[var(--text-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--text-ink)]">Hriattirna:</span>{" "}
          <strong className="text-emerald-400">Reader</strong> tan login a ngai reng reng lo.{" "}
          <strong className="text-[var(--accent-ink)]">Contributor</strong> nih emaw thuziak thehluh i duh erawh chuan Firebase Phone Authentication hmangin i in-verify thung ang.
        </div>

        <div className="space-y-3">
          {roles.map((r) => {
            const active = r.id === currentRole;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  if (r.id === "contributor" && r.requiresAuth && onRequestContributorAuth) {
                    onClose();
                    onRequestContributorAuth();
                  } else {
                    onSelectRole(r.id, nameInput.trim() || contributorName || "Mimal Contributor");
                    onClose();
                  }
                }}
                className={`w-full text-left p-4 sm:p-5 border rounded-2xl transition-all flex items-start gap-4 cursor-pointer ${
                  active
                    ? "border-[var(--accent-ink)] bg-[var(--accent-subtle)] shadow-md"
                    : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shrink-0">
                  {r.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-[var(--text-ink)]">
                      {r.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      · {r.subtitle}
                    </span>
                    {active && (
                      <span className="font-code text-[11px] font-bold text-[var(--accent-ink)]">
                        [Active]
                      </span>
                    )}
                    {r.id === "contributor" && !isContributorAuthenticated && (
                      <span className="font-code text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        Auth Required
                      </span>
                    )}
                    {r.id === "contributor" && isContributorAuthenticated && (
                      <span className="font-code text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Logged In
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
