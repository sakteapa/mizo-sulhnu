import React, { useEffect, useRef, useState } from "react";
import { Flame, Sparkles, Moon, Wind, EyeOff } from "lucide-react";

export type AtmosphereMode = "meipui" | "lasi" | "pialral" | "storm" | "off";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  pulseSpeed: number;
  angle: number;
  angularSpeed: number;
}

interface MizoAtmosphereCanvasProps {
  initialMode?: AtmosphereMode;
  className?: string;
  showControls?: boolean;
}

export const MizoAtmosphereCanvas: React.FC<MizoAtmosphereCanvasProps> = ({
  initialMode = "meipui",
  className = "",
  showControls = true,
}) => {
  const [mode, setMode] = useState<AtmosphereMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zofate_atmosphere_mode");
      if (saved && ["meipui", "lasi", "pialral", "storm", "off"].includes(saved)) {
        return saved as AtmosphereMode;
      }
    }
    return initialMode;
  });

  const [panelOpen, setPanelOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const handleModeChange = (newMode: AtmosphereMode) => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("zofate_atmosphere_mode", newMode);
    }
  };

  useEffect(() => {
    if (mode === "off") {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    const getColorsForMode = (m: AtmosphereMode): string[] => {
      switch (m) {
        case "meipui":
          return [
            "rgba(255, 140, 0, ", // dark orange
            "rgba(255, 185, 30, ", // gold
            "rgba(255, 80, 20, ",  // red-orange
            "rgba(255, 220, 100, ", // bright yellow
          ];
        case "lasi":
          return [
            "rgba(46, 213, 115, ", // emerald
            "rgba(0, 206, 201, ",  // cyan
            "rgba(162, 155, 254, ", // soft violet
            "rgba(255, 234, 167, ", // soft gold
          ];
        case "pialral":
          return [
            "rgba(255, 215, 0, ",  // pure gold
            "rgba(240, 230, 210, ", // starlight
            "rgba(218, 165, 32, ", // goldenrod
            "rgba(255, 250, 235, ", // heavenly glow
          ];
        case "storm":
          return [
            "rgba(180, 170, 160, ", // ash gray
            "rgba(210, 105, 30, ",  // smoky amber
            "rgba(100, 100, 110, ", // dark wind
            "rgba(255, 99, 71, ",   // ember
          ];
        default:
          return ["rgba(255, 180, 50, "];
      }
    };

    const initParticles = () => {
      const count = width < 768 ? 26 : 48;
      const colors = getColorsForMode(mode);
      const list: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const size = mode === "lasi" ? Math.random() * 3.5 + 1.5 : Math.random() * 2.8 + 1.2;
        const maxOpacity = mode === "lasi" ? Math.random() * 0.5 + 0.35 : Math.random() * 0.6 + 0.25;

        let speedX = (Math.random() - 0.5) * 0.6;
        let speedY = -(Math.random() * 0.9 + 0.35); // upward for fire/orbs

        if (mode === "pialral") {
          speedY = Math.random() * 0.45 + 0.2; // drifting down
          speedX = (Math.random() - 0.5) * 0.35;
        } else if (mode === "storm") {
          speedX = Math.random() * 1.8 + 0.8; // wind blowing right
          speedY = Math.random() * 0.7 - 0.3;
        }

        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speedX,
          speedY,
          opacity: Math.random() * maxOpacity,
          maxOpacity,
          color: baseColor,
          pulseSpeed: Math.random() * 0.025 + 0.01,
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.03,
        });
      }
      particlesRef.current = list;
    };

    initParticles();

    let isTabVisible = true;
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = () => {
      if (!isTabVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.speedX + Math.sin(p.angle) * (mode === "storm" ? 0.3 : 0.4);
        p.y += p.speedY;
        p.angle += p.angularSpeed;

        // Pulse opacity
        p.opacity += Math.sin(p.angle) * p.pulseSpeed;
        if (p.opacity > p.maxOpacity) p.opacity = p.maxOpacity;
        if (p.opacity < 0.08) p.opacity = 0.08;

        // Wrap around borders
        if (mode === "pialral") {
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (mode === "storm") {
          if (p.x > width + 10) {
            p.x = -10;
            p.y = Math.random() * height;
          }
        } else {
          // meipui / lasi floats up
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
        }

        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Draw particle with subtle glow radial
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * (mode === "lasi" ? 2.6 : 1.8)
        );
        gradient.addColorStop(0, `${p.color}${p.opacity})`);
        gradient.addColorStop(0.5, `${p.color}${p.opacity * 0.4})`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * (mode === "lasi" ? 2.6 : 1.8), 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  return (
    <>
      {/* Background Ambient Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
        style={{ opacity: mode === "off" ? 0 : 0.85 }}
      />

      {/* Atmospheric Controls Pill (Bottom Right Floating) */}
      {showControls && (
        <div className="no-print fixed bottom-18 sm:bottom-6 right-4 z-30 flex flex-col items-end">
          {panelOpen && (
            <div className="mb-2 p-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shadow-xl backdrop-blur-md flex flex-col gap-1.5 text-xs animate-fadeIn w-48">
              <div className="px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-hairline)]">
                Boruak Animation
              </div>
              <button
                type="button"
                onClick={() => {
                  handleModeChange("meipui");
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === "meipui"
                    ? "bg-amber-500/15 text-amber-500 font-semibold"
                    : "text-[var(--text-ink)] hover:bg-[var(--bg-canvas)]"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Zawlbuk Meipui</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModeChange("lasi");
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === "lasi"
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-[var(--text-ink)] hover:bg-[var(--bg-canvas)]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tan Tlang Lasi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModeChange("pialral");
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === "pialral"
                    ? "bg-yellow-500/15 text-yellow-400 font-semibold"
                    : "text-[var(--text-ink)] hover:bg-[var(--bg-canvas)]"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-yellow-400" />
                <span>Pialral Arsi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModeChange("storm");
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === "storm"
                    ? "bg-stone-500/15 text-stone-300 font-semibold"
                    : "text-[var(--text-ink)] hover:bg-[var(--bg-canvas)]"
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-stone-400" />
                <span>Ral Do Thlipui</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModeChange("off");
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === "off"
                    ? "bg-red-500/15 text-red-400 font-semibold"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-canvas)]"
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-red-400" />
                <span>Animation Tihthiap</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPanelOpen((prev) => !prev)}
            title="Boruak Animation thlakna"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-[var(--text-ink)] shadow-lg hover:border-[var(--accent-ink)] hover:scale-105 active:scale-95 transition-all text-xs font-medium backdrop-blur-md"
          >
            {mode === "meipui" && <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
            {mode === "lasi" && <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
            {mode === "pialral" && <Moon className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />}
            {mode === "storm" && <Wind className="w-3.5 h-3.5 text-stone-400" />}
            {mode === "off" && <EyeOff className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            <span className="hidden sm:inline">
              {mode === "meipui" && "Meipui"}
              {mode === "lasi" && "Lasi Eng"}
              {mode === "pialral" && "Pialral"}
              {mode === "storm" && "Ral Do"}
              {mode === "off" && "Off"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};
