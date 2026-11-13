import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  GitBranch,
  ShieldAlert,
  Upload,
} from "lucide-react";
import type { StudioView, UserRole } from "../types/book";

interface MobileBottomNavProps {
  userRole: UserRole;
  activeView: StudioView;
  adminAlertCount: number;
  contributorCount: number;
  onSelectView: (view: StudioView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  userRole,
  activeView,
  adminAlertCount,
  contributorCount,
  onSelectView,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="no-print md:hidden fixed bottom-3 right-3 z-40">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand mobile navigation"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-ink)] rounded-full shadow-lg"
        >
          <ChevronUp className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
          <span>Menu</span>
        </button>
      </div>
    );
  }

  return (
    <nav
      aria-label="Mobile studio navigation"
      className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)]/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around h-14 px-1">
        <button
          type="button"
          onClick={() => onSelectView("manuscript")}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeView === "manuscript"
              ? "text-[var(--accent-ink)] font-semibold"
              : "text-[var(--text-muted)]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{userRole === "reader" ? "Chhiarna" : "Lehkhabu"}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView("dna")}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeView === "dna"
              ? "text-[var(--accent-ink)] font-semibold"
              : "text-[var(--text-muted)]"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>DNA Chain</span>
        </button>

        {userRole !== "reader" && (
          <button
            type="button"
            onClick={() => onSelectView("upload")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              activeView === "upload"
                ? "text-[var(--accent-ink)] font-semibold"
                : "text-[var(--text-muted)]"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        )}

        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => onSelectView("admin")}
            className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              activeView === "admin"
                ? "text-[var(--accent-ink)] font-semibold"
                : "text-[var(--text-muted)]"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="tabular-nums">
              Admin{adminAlertCount > 0 ? ` (${adminAlertCount})` : ""}
            </span>
          </button>
        )}

        {userRole === "contributor" && (
          <button
            type="button"
            onClick={() => onSelectView("submissions")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              activeView === "submissions"
                ? "text-[var(--accent-ink)] font-semibold"
                : "text-[var(--text-muted)]"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span className="tabular-nums">
              Thawn{contributorCount > 0 ? ` (${contributorCount})` : ""}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse mobile navigation"
          className="px-3 flex flex-col items-center justify-center gap-0.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-ink)] border-l border-[var(--border-hairline)]"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Hide</span>
        </button>
      </div>
    </nav>
  );
};
