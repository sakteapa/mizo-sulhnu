import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Flame,
  Sun,
  Shield,
  ShieldAlert,
  Skull,
  Ghost,
  Eye,
  Wand2,
  Scroll,
  Compass,
  Crown,
  PartyPopper,
  Landmark,
  Swords,
  Heart,
  Award,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  HelpCircle,
  X,
  Share2,
  Layers,
  Globe,
  Droplet,
  Mountain,
  Trees,
  Coins,
  Building2,
  BrainCircuit,
  CircleDot,
  Feather,
  Mic2,
  HeartHandshake,
} from "lucide-react";
import type { LoreEntity, LoreRealm } from "../types/book";
import {
  MIZO_MYTHOLOGY_LORE_DATABASE,
  LORE_REALM_METADATA,
} from "../data/mizoMythologyLore";

const LORE_IMAGES: Record<string, string> = {
  "lore-chawngtinleri": "/illustrations/lasi_chawngtinleri_tantlang.jpg",
  "lore-tan-tlang": "/illustrations/bung2_rih_dil_tan_tlang.jpg",
  "lore-rih-dil": "/illustrations/afterlife_rih_dil_pialral.jpg",
  "lore-pialral": "/illustrations/afterlife_rih_dil_pialral.jpg",
  "lore-keimi": "/illustrations/folk_kungawrhi_keimi_cave.jpg",
  "lore-chhura": "/illustrations/folk_chhura_sekibuhchhuak.jpg",
  "lore-nahaia": "/illustrations/folk_chhura_sekibuhchhuak.jpg",
  "lore-mauruangi": "/illustrations/folk_mauruangi_vamur.jpg",
  "lore-kungawrhi": "/illustrations/folk_kungawrhi_keimi_cave.jpg",
  "lore-chepahakhata": "/illustrations/chepahakhata_hornbill_wit.jpg",
  "lore-darlalpuii": "/illustrations/bung4_sibuta_lung_darlalpuii.jpg",
  "lore-thlanrawkpa": "/illustrations/bung8_thlanrawn_rawt_battle.jpg",
  "lore-khampat-bungpui": "/illustrations/bung1_khampat_bungpui.jpg",
  "lore-chhinlung": "/illustrations/bung1_chhinlung_migration.jpg",
  "lore-lalruanga": "/illustrations/bung2_rih_dil_tan_tlang.jpg",
  "lore-keichala": "/illustrations/folk_kungawrhi_keimi_cave.jpg",
  "lore-vai-lal": "/illustrations/chepahakhata_hornbill_wit.jpg",
  "lore-reng-lal": "/illustrations/bung5_sailo_lalte_council.jpg",
  "lore-pu-vana": "/illustrations/afterlife_rih_dil_pialral.jpg",
  "lore-khuanu": "/illustrations/afterlife_rih_dil_pialral.jpg",
};

interface MythologyCodexStudioProps {
  onNavigateToChapter?: (bookId: string, chapterId: number) => void;
  initialSelectedId?: string | null;
}

export function MythologyCodexStudio({
  onNavigateToChapter,
  initialSelectedId = null,
}: MythologyCodexStudioProps) {
  const [selectedRealm, setSelectedRealm] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLoreId, setActiveLoreId] = useState<string | null>(
    initialSelectedId || null
  );
  const [activeTab, setActiveTab] = useState<"cards" | "chains">("cards");

  // Icon mapping helper
  const getIcon = (name: string, className = "w-4 h-4") => {
    switch (name) {
      case "Sun":
        return <Sun className={className} />;
      case "HeartHandshake":
        return <HeartHandshake className={className} />;
      case "Sparkles":
      case "Sparkle":
        return <Sparkles className={className} />;
      case "Flame":
        return <Flame className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "Mountain":
        return <Mountain className={className} />;
      case "Droplet":
        return <Droplet className={className} />;
      case "Trees":
        return <Trees className={className} />;
      case "ShieldAlert":
      case "Shield":
        return <ShieldAlert className={className} />;
      case "Skull":
        return <Skull className={className} />;
      case "Ghost":
        return <Ghost className={className} />;
      case "Eye":
        return <Eye className={className} />;
      case "CircleDot":
        return <CircleDot className={className} />;
      case "Wand2":
        return <Wand2 className={className} />;
      case "Coins":
        return <Coins className={className} />;
      case "Scroll":
        return <Scroll className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "Crown":
        return <Crown className={className} />;
      case "PartyPopper":
        return <PartyPopper className={className} />;
      case "Landmark":
        return <Landmark className={className} />;
      case "Swords":
        return <Swords className={className} />;
      case "BrainCircuit":
        return <BrainCircuit className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Award":
        return <Award className={className} />;
      case "Feather":
        return <Feather className={className} />;
      case "Monument":
        return <Landmark className={className} />;
      case "Mic2":
        return <Mic2 className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Filtered lore list
  const filteredLore = useMemo(() => {
    return MIZO_MYTHOLOGY_LORE_DATABASE.filter((item) => {
      const matchesRealm =
        selectedRealm === "all" || item.realm === selectedRealm;
      if (!matchesRealm) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.aliases.some((a) => a.toLowerCase().includes(q)) ||
        item.powers.some((p) => p.toLowerCase().includes(q)) ||
        item.lore.toLowerCase().includes(q)
      );
    });
  }, [selectedRealm, searchQuery]);

  // Active lore entity
  const activeLore = useMemo(() => {
    if (!activeLoreId) return null;
    return (
      MIZO_MYTHOLOGY_LORE_DATABASE.find((item) => item.id === activeLoreId) ||
      null
    );
  }, [activeLoreId]);

  // Connected entities for active modal
  const connectedEntities = useMemo(() => {
    if (!activeLore) return [];
    return MIZO_MYTHOLOGY_LORE_DATABASE.filter((item) =>
      activeLore.connectedEntityIds.includes(item.id)
    );
  }, [activeLore]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-ink)] pb-24">
      {/* Hero Header */}
      <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)]/60 backdrop-blur px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-code tracking-wider text-[var(--accent-ink)] uppercase font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Mizo Mythology &amp; Folklore Codex</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">
                {MIZO_MYTHOLOGY_LORE_DATABASE.length} Entitie(s) Inthlunzawm
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-ink)]">
              Mizo Dawi, Lasi &amp; Thawnthu Khawvel
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl font-book">
              Lasi, Ramhuai, Keimi, Dawithiam, Arsi, Vanchung Mite, Mitthi Khua,
              Pialral leh Zofate thawnthu sawi hlawh tinrengte — Games RPG Codex
              ang maia inthlunzawm leh chipchiar takin index vek a ni.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-hairline)] self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("cards")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-ui font-medium transition-colors ${
                activeTab === "cards"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Codex Cards ({filteredLore.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chains")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-ui font-medium transition-colors ${
                activeTab === "chains"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Story Chains (Inthlunzawmna)</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Realm Filters */}
        <div className="max-w-7xl mx-auto mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zawng rawh (e.g. Lasi, Keimi, Lalruanga, Arsi, Sih Huai, Thlanrawkpa, Chhura...)"
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl focus:outline-none focus:border-[var(--accent-ink)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Realm Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {Object.entries(LORE_REALM_METADATA).map(([key, meta]) => {
              const isSelected = selectedRealm === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRealm(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-ui font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] border-[var(--accent-ink)] shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                  }`}
                >
                  {getIcon(meta.icon, "w-3.5 h-3.5")}
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {activeTab === "cards" && (
          <div>
            {filteredLore.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border-hairline)] bg-[var(--bg-card)]">
                <HelpCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
                <h3 className="font-display text-base font-semibold">
                  A vang tlat mai
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  "{searchQuery}" nena inrem thawnthu emaw dawi hmuh a ni lo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRealm("all");
                  }}
                  className="mt-4 px-4 py-1.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded-lg"
                >
                  Filter Zawng Zawng Hlip Rawh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLore.map((item) => {
                  const realmMeta =
                    LORE_REALM_METADATA[item.realm] || LORE_REALM_METADATA.all;

                  return (
                    <motion.div
                      key={item.id}
                      layoutId={`card-${item.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] hover:border-[var(--accent-ink)]/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                      onClick={() => setActiveLoreId(item.id)}
                    >
                      {/* Optional Artwork Thumbnail */}
                      {LORE_IMAGES[item.id] && (
                        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden bg-stone-950">
                          <img
                            src={LORE_IMAGES[item.id]}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
                        </div>
                      )}

                      {/* Top Badges */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-code uppercase font-semibold border ${realmMeta.badgeColor}`}
                          >
                            {getIcon(item.iconName, "w-3 h-3")}
                            <span>{realmMeta.label.split(" ")[0]}</span>
                          </span>

                          <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-hairline)]">
                            {item.rarity}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="font-display text-lg font-bold text-[var(--text-ink)] group-hover:text-[var(--accent-ink)] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] font-book line-clamp-2 mt-1 leading-relaxed">
                          {item.tagline}
                        </p>

                        {/* Key Powers Pills */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.powers.slice(0, 3).map((pow, pidx) => (
                            <span
                              key={pidx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-ink)]/85"
                            >
                              ⚡ {pow}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-5 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-ui">
                        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-[var(--accent-ink)]" />
                          <span>
                            {item.connectedEntityIds.length} Thlunzawm
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-[var(--accent-ink)] group-hover:translate-x-1 transition-transform">
                          <span>Codex En Rawh</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Story Chains Interactive Visualizer Tab */}
        {activeTab === "chains" && (
          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)]">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[var(--accent-ink)]" />
                <span>Mizo Folklore Chains (Inthlunzawmna Graph)</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Zofate thawnthu leh sakhua chu a inthlun zawm vek a; helai aṭang
                hian thil thleng inzawm kual dan i chhui thei ang.
              </p>
            </div>

            {/* Chain 1: Keimi & Dawi Indona */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-rose-500 flex items-center gap-2">
                  <Skull className="w-4 h-4" />
                  <span>Chain 1: Keimi, Dawi &amp; Pasaltha Indo</span>
                </h3>
                <span className="text-xs font-code text-[var(--text-muted)]">
                  Were-Tiger &amp; Sorcery Web
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Lalruanga dawi thiltihtheihna leh Keichala sakei rilru inbeihna
                aṭangin Kungawrhi puk keimi leh Vankal pasalthate thlengin a
                inzawm chho a ni.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-dawithiam-lalruanga")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-purple-500 text-xs font-medium flex items-center gap-2"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dawithiam Lalruanga</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-keichala")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-rose-500 text-xs font-medium flex items-center gap-2"
                >
                  <Skull className="w-3.5 h-3.5 text-rose-400" />
                  <span>Keichala (Keimi)</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-keimi")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-rose-500 text-xs font-medium flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Puk Chhung Keimi</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-kungawrhi")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-emerald-500 text-xs font-medium flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kungawrhi &amp; Pasalthate</span>
                </button>
              </div>
            </div>

            {/* Chain 2: The Spirit Afterlife Path */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-indigo-500 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Chain 2: Thlaraute Pialral Kalkawng</span>
                </h3>
                <span className="text-xs font-code text-[var(--text-muted)]">
                  The Mizo Underworld Journey
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Mitthi thlarau zinkawng chu Rih Dil-ah chawlhin Hawilopui par
                an tawn a, Lunglo tui inin Pialral leh Mitthi Khua an thleng.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-rih-dil")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-indigo-500 text-xs font-medium flex items-center gap-2"
                >
                  <Droplet className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rih Dil (Thinlung Dil)</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() =>
                    setActiveLoreId("lore-lunglo-tui-hawilopui")
                  }
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-indigo-500 text-xs font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hawilopui &amp; Lunglo Tui</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-hringlang-tlang")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-indigo-500 text-xs font-medium flex items-center gap-2"
                >
                  <Mountain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hringlang Tlang</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-pialral")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-amber-500 text-xs font-medium flex items-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pialral (Huaisente Hmun)</span>
                </button>
              </div>
            </div>

            {/* Chain 3: Chepahakhata & Vai Lal Riddles */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-amber-500 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span>Chain 3: Chepahakhata, Vanchung Nula &amp; Vai Lal</span>
                </h3>
                <span className="text-xs font-code text-[var(--text-muted)]">
                  Wisdom vs Emperors Web
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Changêl hmun fahrah Chepahakhata'n Vanchung nula nupuiah neiin
                Belte-phai-thei-lo hmanga Vai Lal finna a hneh dan.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-chepahakhata")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-amber-500 text-xs font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chepahakhata</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() =>
                    setActiveLoreId("lore-vanchung-nula-tlangval")
                  }
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-amber-500 text-xs font-medium flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vanchung Nula</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-dawi-bu-relics")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-amber-500 text-xs font-medium flex items-center gap-2"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Belte-phai-thei-lo</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-vai-lal")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-orange-500 text-xs font-medium flex items-center gap-2"
                >
                  <Landmark className="w-3.5 h-3.5 text-orange-400" />
                  <span>Vai Lalte Finfiahna</span>
                </button>
              </div>
            </div>

            {/* Chain 4: Chemtatrawta Cause-and-Effect Chain */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-cyan-500 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Chain 4: Chemtatrawta Inthlunzawmna Finna</span>
                </h3>
                <span className="text-xs font-code text-[var(--text-muted)]">
                  The Chain of Causality
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Chemtatrawta chem tat aṭanga vau-pangpar, chingpiri, sakei, arpa,
                chepa, vawk, rulpui thlenga thil inthlun chho dan.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-chemtatrawta")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-cyan-500 text-xs font-medium flex items-center gap-2"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chemtatrawta</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-rulpui-lian")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-rose-500 text-xs font-medium flex items-center gap-2"
                >
                  <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rulpui Lian</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => setActiveLoreId("lore-tlumtea")}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-emerald-500 text-xs font-medium flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tlumtea Huaisenna</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lore Dossier Modal / Inspector Drawer */}
      <AnimatePresence>
        {activeLore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Optional Hero Artwork Banner */}
              {LORE_IMAGES[activeLore.id] && (
                <div className="relative w-full h-44 sm:h-56 overflow-hidden bg-stone-950 shrink-0">
                  <motion.img
                    src={LORE_IMAGES[activeLore.id]}
                    alt={activeLore.title}
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-black/40" />
                  <button
                    type="button"
                    onClick={() => setActiveLoreId(null)}
                    aria-label="Khâr rawh"
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-ink)]/10 text-[var(--accent-ink)] flex items-center justify-center shrink-0 border border-[var(--accent-ink)]/20">
                    {getIcon(activeLore.iconName, "w-6 h-6")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--accent-ink)] text-[var(--accent-contrast)] uppercase font-semibold">
                        {activeLore.realm}
                      </span>
                      <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-muted)] border border-[var(--border-hairline)]">
                        {activeLore.rarity}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold mt-1 text-[var(--text-ink)]">
                      {activeLore.title}
                    </h2>
                    {activeLore.aliases.length > 0 && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Hming dangte: {activeLore.aliases.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {!LORE_IMAGES[activeLore.id] && (
                  <button
                    type="button"
                    onClick={() => setActiveLoreId(null)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)] rounded-lg hover:bg-[var(--bg-canvas)] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tagline */}
                <div className="p-3.5 rounded-xl bg-[var(--accent-ink)]/5 border border-[var(--accent-ink)]/15 text-xs sm:text-sm font-book italic text-[var(--text-ink)]">
                  "{activeLore.tagline}"
                </div>

                {/* Lore Narrative Text */}
                <div>
                  <h4 className="text-xs font-code uppercase tracking-wider text-[var(--accent-ink)] font-semibold mb-2">
                    Thawnthu &amp; Chanchin Kimchang
                  </h4>
                  <p className="text-sm font-book leading-relaxed text-[var(--text-ink)]/90 whitespace-pre-line">
                    {activeLore.lore}
                  </p>
                </div>

                {/* Powers & Weaknesses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
                    <h4 className="text-xs font-code uppercase tracking-wider text-emerald-500 font-semibold flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Thiltihtheihna (Powers &amp; Traits)</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[var(--text-ink)]/85">
                      {activeLore.powers.map((pow, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✔</span>
                          <span>{pow}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
                    <h4 className="text-xs font-code uppercase tracking-wider text-rose-500 font-semibold flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Serh leh Sang / Hneh Dan (Weakness)</span>
                    </h4>
                    <p className="text-xs text-[var(--text-ink)]/85 leading-relaxed">
                      {activeLore.weaknessOrTaboo}
                    </p>
                  </div>
                </div>

                {/* Secret Clue / Riddle */}
                {activeLore.secretClue && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-code uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Thuruk / Secret Lore Clue</span>
                    </span>
                    <p className="text-[var(--text-ink)]/90 font-book">
                      {activeLore.secretClue}
                    </p>
                  </div>
                )}

                {/* Hlado / Riddle Block if exists */}
                {activeLore.riddleOrHlado && (
                  <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs font-book whitespace-pre-line text-[var(--text-ink)]/90">
                    {activeLore.riddleOrHlado}
                  </div>
                )}

                {/* Bi-Directionally Connected Entities Web */}
                <div>
                  <h4 className="text-xs font-code uppercase tracking-wider text-[var(--accent-ink)] font-semibold mb-2 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Inthlunzawmna Web (Connected Entities)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {connectedEntities.map((conn) => (
                      <button
                        key={conn.id}
                        type="button"
                        onClick={() => setActiveLoreId(conn.id)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--accent-ink)] text-xs font-medium text-[var(--text-ink)] transition-colors flex items-center gap-2 group"
                      >
                        {getIcon(conn.iconName, "w-3 h-3 text-[var(--accent-ink)]")}
                        <span>{conn.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Associated Reading Chapters */}
                {activeLore.chapterRefs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-code uppercase tracking-wider text-[var(--accent-ink)] font-semibold mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Lehkhabu &amp; Bung Inzawm (Read in Manuscript)</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeLore.chapterRefs.map((ref, ridx) => (
                        <button
                          key={ridx}
                          type="button"
                          onClick={() => {
                            if (onNavigateToChapter) {
                              onNavigateToChapter(ref.bookId, ref.chapterId);
                              setActiveLoreId(null);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:opacity-90 text-xs font-medium transition-opacity flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{ref.label} Chhiar Rawh</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
