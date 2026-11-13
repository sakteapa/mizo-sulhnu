import React, { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface PWAInstallButtonProps {
  variant?: "header" | "banner";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "header",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (variant === "banner") {
    if (bannerDismissed || (!isInstallable && !isIOS)) return null;
    return (
      <>
        <div className="no-print border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Smartphone className="w-4 h-4 text-[var(--accent-ink)] shrink-0" />
            <p className="text-[var(--text-ink)] truncate">
              <strong className="font-semibold">Offline PWA:</strong>{" "}
              Phone/PC-ah app angin dah la, Internet awm loh pawhin lehkhabu leh DNA Chain hmang rawh.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isInstallable) {
                  void install();
                } else {
                  setShowIOSGuide(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App (Phone/PC-ah Dah Rawh)</span>
            </button>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss install banner"
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {showIOSGuide && (
          <IOSInstallModal onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        title="Install App (Phone/PC-ah Dah Rawh)"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium border border-[var(--accent-ink)]/40 bg-[var(--accent-subtle)] text-[var(--accent-ink)] hover:bg-[var(--accent-ink)] hover:text-[var(--accent-contrast)] rounded-md transition-colors whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Install on iPhone / iPad"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
          <span className="hidden md:inline">Install iOS</span>
        </button>
        {showIOSGuide && (
          <IOSInstallModal onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  return null;
};

const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Install on iPhone or iPad"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-md border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 shadow-xl space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-[var(--text-ink)]">
          iPhone / iPad-ah Dah Dan
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--text-ink)]">
        <li>
          Safari hnuai lamah <strong>Share</strong> icon kha hmet rawh.
        </li>
        <li>
          Chhuk la, <strong>Add to Home Screen</strong> tih kha thlang rawh.
        </li>
        <li>
          A dinglam chungah <strong>Add</strong> tih hmet la, Offline App angin i hmang thei ang.
        </li>
      </ol>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded"
      >
        Awle (Close)
      </button>
    </div>
  </div>
);
