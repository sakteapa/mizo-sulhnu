import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { PersonNode } from "../types/book";
import type { TraceLayer } from "../utils/dnaGraph";
import { VerificationTag } from "./VerificationTag";

interface DnaGraphVisualizerProps {
  layers: TraceLayer[];
  orientation: "top-down" | "bottom-up";
  selectedPersonId: string;
  privacyLocked: boolean;
  onToggleOrientation: () => void;
  onSelectPerson: (personId: string) => void;
}

export const DnaGraphVisualizer: React.FC<DnaGraphVisualizerProps> = ({
  layers,
  orientation,
  selectedPersonId,
  privacyLocked,
  onToggleOrientation,
  onSelectPerson,
}) => {
  const orderedLayers =
    orientation === "bottom-up" ? [...layers].reverse() : layers;

  return (
    <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md overflow-hidden">
      {/* Graph Header Bar */}
      <div className="px-5 py-3.5 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
            DNA Helix &amp; Genealogical Network
          </p>
          <p className="text-xs text-[var(--text-muted)] tabular-nums">
            {orderedLayers.reduce((s, l) => s + l.nodes.length, 0)} nodes across{" "}
            {orderedLayers.length} generations
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleOrientation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          {orientation === "top-down" ? (
            <>
              <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
              <span>Top-Down (Thlahtu Atangin)</span>
            </>
          ) : (
            <>
              <ArrowUp className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
              <span>Bottom-Up (A Let Zawngin)</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Helix-Framed Layered Tree */}
      <div className="relative p-6 sm:p-8 overflow-x-auto">
        {/* Subtle decorative double-helix SVG spine running behind generation tiers */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 400"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-28 h-full opacity-15"
        >
          <path
            d="M 20 0 C 100 50, 100 100, 20 150 C -60 200, 100 250, 20 300 C -60 350, 100 380, 20 400"
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="2"
          />
          <path
            d="M 100 0 C 20 50, 20 100, 100 150 C 180 200, 20 250, 100 300 C 180 350, 20 380, 100 400"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {orderedLayers.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--text-muted)]">
            Chhuizuina tur mi emaw thlahtu emaw thlang rawh.
          </div>
        ) : (
          <div className="relative z-10 space-y-6">
            {orderedLayers.map((layer, layerIdx) => (
              <div key={`${layer.depth}-${layerIdx}`} className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px flex-1 max-w-[80px] bg-[var(--border-hairline)]" />
                  <span className="font-code text-[11px] text-[var(--text-muted)] tabular-nums">
                    Chhuan {layer.depth + 1}
                  </span>
                  <span className="h-px flex-1 max-w-[80px] bg-[var(--border-hairline)]" />
                </div>

                <div className="flex flex-wrap items-stretch justify-center gap-3">
                  {layer.nodes.map((node: PersonNode) => {
                    const isSelected = node.id === selectedPersonId;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => onSelectPerson(node.id)}
                        className={`text-left w-full sm:w-64 p-3.5 rounded-md border transition-colors ${
                          isSelected
                            ? "border-[var(--accent-ink)] bg-[var(--accent-subtle)]"
                            : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--text-muted)]"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-base font-semibold text-[var(--text-ink)] truncate">
                            {node.fullName}
                          </span>
                          <span className="font-code text-[11px] text-[var(--accent-ink)] shrink-0">
                            {privacyLocked ? "••" : node.bloodGroup}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)] truncate">
                          {node.clan}
                          {node.villages.length > 0
                            ? ` · ${node.villages.slice(0, 2).join(", ")}`
                            : ""}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <span className="font-code text-[10.5px] text-[var(--text-muted)] tabular-nums">
                            {node.birthDate || "?"}
                            {node.deathDate ? ` – ${node.deathDate}` : ""}
                          </span>
                          <VerificationTag status={node.verification} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {layerIdx < orderedLayers.length - 1 && (
                  <div
                    className="flex justify-center text-[var(--text-muted)]"
                    aria-hidden="true"
                  >
                    <span className="h-4 w-px bg-[var(--border-hairline)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
