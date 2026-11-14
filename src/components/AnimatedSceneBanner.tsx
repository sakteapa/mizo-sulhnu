import React from "react";
import { motion } from "motion/react";
import { Sparkles, Compass, Users, ChevronDown } from "lucide-react";

interface AnimatedSceneBannerProps {
  title: string;
  bungLabel: string;
  eraOrTheme?: string;
  imageUrl?: string;
  imageAlt?: string;
  keyFigures?: string[];
  onScrollToReading?: () => void;
}

export const AnimatedSceneBanner: React.FC<AnimatedSceneBannerProps> = ({
  title,
  bungLabel,
  eraOrTheme,
  imageUrl,
  imageAlt,
  keyFigures = [],
  onScrollToReading,
}) => {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border-hairline)] shadow-2xl mb-8 group bg-stone-950">
      {/* Animated Ken Burns Background Image */}
      {imageUrl ? (
        <motion.div
          initial={{ scale: 1.0, x: 0 }}
          animate={{
            scale: [1.0, 1.08, 1.04, 1.0],
            x: [0, -12, 10, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-stone-900 to-emerald-950/40" />
      )}

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />

      {/* Floating Sparkles & Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl space-y-3"
        >
          {/* Era & Bung Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="px-3 py-1 rounded-full bg-[var(--accent-ink)] text-[var(--accent-contrast)] font-bold tracking-wide uppercase shadow-sm">
              {bungLabel}
            </span>
            {eraOrTheme && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-stone-200">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{eraOrTheme}</span>
              </span>
            )}
          </div>

          {/* Epic Chapter Title */}
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
            {title}
          </h1>

          {/* Key Figures Badges */}
          {keyFigures.length > 0 && (
            <div className="hidden sm:flex flex-wrap items-center gap-1.5 pt-1">
              <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {keyFigures.slice(0, 6).map((fig) => (
                <span
                  key={fig}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 text-stone-300"
                >
                  {fig}
                </span>
              ))}
              {keyFigures.length > 6 && (
                <span className="text-[11px] text-stone-400">
                  +{keyFigures.length - 6} dang...
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Scroll Action Button */}
        {onScrollToReading && (
          <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8">
            <button
              type="button"
              onClick={onScrollToReading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span>Chhiar Tan Rawh</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
