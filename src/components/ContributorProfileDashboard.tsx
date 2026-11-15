import React, { useState } from "react";
import {
  Star,
  Shield,
  Award,
  Scroll,
  Search,
  Crown,
  Sparkles,
  Flame,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  User,
  MapPin,
  Users,
  Feather,
  Save,
  KeyRound,
  LogOut,
  Trophy,
  ExternalLink,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import type {
  ContributorBadge,
  ContributorProfile,
  TopContributorLeaderboardItem,
} from "../types/contributor";
import type { SubmissionRecord } from "../types/book";
import {
  MIZO_AVATAR_OPTIONS,
  STANDARD_CONTRIBUTOR_BADGES,
  INITIAL_TOP_CONTRIBUTORS,
} from "../data/contributorData";
import {
  saveStoredContributor,
  setPasswordForAccount,
  linkEmailToAccount,
  logoutContributor,
} from "../services/firebaseAuth";
import { SeverityTag, SubmissionStatusTag } from "./SeverityAndStatusTag";

interface ContributorProfileDashboardProps {
  profile: ContributorProfile;
  onUpdateProfile: (updated: ContributorProfile) => void;
  onLogout: () => void;
  submissions: SubmissionRecord[];
  onNavigateToView?: (view: any) => void;
}

export const ContributorProfileDashboard: React.FC<
  ContributorProfileDashboardProps
> = ({ profile, onUpdateProfile, onLogout, submissions, onNavigateToView }) => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "badges" | "leaderboard" | "submissions"
  >("profile");

  // Profile Edit State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [clan, setClan] = useState(profile.clan || "Lusei");
  const [village, setVillage] = useState(profile.village || "Aizawl");
  const [bio, setBio] = useState(
    profile.bio ||
      "Mizo chanchin, tobul leh thawnthu hlui vawng nungtu leh ziah belhtu."
  );
  const [avatarIcon, setAvatarIcon] = useState(profile.avatarIcon || "🛡️");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Security Dual-Login State
  const [newEmail, setNewEmail] = useState(profile.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Filter submissions by this contributor
  const mySubmissions = submissions.filter(
    (s) =>
      s.submittedByRole === "contributor" &&
      (s.submitterName === profile.displayName ||
        s.submitterName.toLowerCase().includes(profile.displayName.toLowerCase()))
  );

  const approvedSubmissions = mySubmissions.filter((s) => s.status === "approved").length;
  const totalSubmissions = Math.max(mySubmissions.length, profile.totalSubmissionsCount);

  // Render Star Rating
  const renderStarRating = (rating: number, maxStars = 5) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const filled = idx + 1 <= Math.floor(rating);
          const half = !filled && idx < rating;
          return (
            <Star
              key={idx}
              className={`w-4 h-4 ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-stone-600"
              }`}
            />
          );
        })}
        <span className="font-code font-bold text-sm ml-1 text-amber-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case "shield":
        return <Shield className="w-5 h-5 text-indigo-400" />;
      case "scroll":
        return <Scroll className="w-5 h-5 text-amber-400" />;
      case "search":
        return <Search className="w-5 h-5 text-emerald-400" />;
      case "crown":
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-sky-400" />;
      case "flame":
        return <Flame className="w-5 h-5 text-rose-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ContributorProfile = {
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      clan: clan.trim(),
      village: village.trim(),
      bio: bio.trim(),
      avatarIcon,
      lastActiveAt: Date.now(),
    };
    saveStoredContributor(updated);
    onUpdateProfile(updated);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // Handle Email & Password Security Link
  const handleLinkSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecurityNotice(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError("Password pahnihte hi a inang lo.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setSecurityError("Password hi thumal 6 aia tlem lo a ni tur a ni.");
      return;
    }

    setIsSavingSecurity(true);
    try {
      if (newEmail.trim()) {
        const res = await linkEmailToAccount(newEmail, newPassword || undefined);
        if (!res.success) {
          setSecurityError(res.message);
          setIsSavingSecurity(false);
          return;
        }
      } else if (newPassword) {
        const res = await setPasswordForAccount(newPassword);
        if (!res.success) {
          setSecurityError(res.message);
          setIsSavingSecurity(false);
          return;
        }
      }

      const updated: ContributorProfile = {
        ...profile,
        email: newEmail.trim() || profile.email,
        hasPasswordAuth: Boolean(newPassword || profile.hasPasswordAuth),
      };
      saveStoredContributor(updated);
      onUpdateProfile(updated);
      setSecurityNotice(
        "Dual Login settings hlawhtling taka update a ni e! Password emaw Email hmangin i login thei tawh ang."
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSecurityError(err.message || "Security settings siam theih a ni lo.");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Contributor Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-hairline)] bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-card)] to-[var(--bg-canvas)] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-ink)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Main Info */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative text-5xl sm:text-6xl p-3 sm:p-4 rounded-3xl bg-[var(--bg-canvas)] border-2 border-[var(--accent-ink)]/30 shadow-inner flex items-center justify-center shrink-0">
              {profile.avatarIcon || "🛡️"}
              {profile.isVerified && (
                <div
                  title="Firebase Phone Verified"
                  className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full border-2 border-[var(--bg-card)] shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-code px-2.5 py-0.5 rounded-full bg-[var(--accent-ink)] text-[var(--accent-contrast)] uppercase font-semibold">
                  Contributor
                </span>
                {profile.isVerified && (
                  <span className="text-[10px] font-code px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Firebase Phone Verified
                  </span>
                )}
                {profile.hasPasswordAuth && (
                  <span className="text-[10px] font-code px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                    <KeyRound className="w-3 h-3" />
                    Password Ready
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-ink)]">
                {profile.displayName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] font-book">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
                  {profile.clan || "Zofate Thlah"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
                  {profile.village || "Mizoram"}
                </span>
                {profile.phoneNumber && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {profile.phoneNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rating & Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto p-4 md:p-0 bg-[var(--bg-canvas)] md:bg-transparent rounded-2xl border border-[var(--border-hairline)] md:border-0">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-code uppercase tracking-wider text-[var(--text-muted)]">
                  Contributor Rating
                </p>
                <div className="mt-0.5">{renderStarRating(profile.rating || 5.0)}</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  await logoutContributor();
                  onLogout();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[var(--border-hairline)]">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
            <p className="text-[11px] font-code text-[var(--text-muted)] uppercase">
              Approved Edits
            </p>
            <p className="text-xl sm:text-2xl font-bold font-display text-[var(--text-ink)] mt-0.5">
              {approvedSubmissions} / {totalSubmissions}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
            <p className="text-[11px] font-code text-[var(--text-muted)] uppercase">
              Words Penned
            </p>
            <p className="text-xl sm:text-2xl font-bold font-display text-[var(--text-ink)] mt-0.5">
              {(profile.totalWordsPenned || 1250).toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
            <p className="text-[11px] font-code text-[var(--text-muted)] uppercase">
              Badges Earned
            </p>
            <p className="text-xl sm:text-2xl font-bold font-display text-[var(--accent-ink)] mt-0.5">
              {profile.badges?.length || 2} Badges
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
            <p className="text-[11px] font-code text-[var(--text-muted)] uppercase">
              Trust Score
            </p>
            <p className="text-xl sm:text-2xl font-bold font-display text-emerald-400 mt-0.5">
              98%
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-[var(--border-hairline)] scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile Update</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)]"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password &amp; Email Login</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "badges"
              ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Ka Badges ({profile.badges?.length || 2})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "leaderboard"
              ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)]"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Top Contributors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "submissions"
              ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ka Thil Thawn Te ({mySubmissions.length})</span>
        </button>
      </div>

      {/* Tab 1: Profile Update */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] space-y-6"
        >
          <div className="border-b border-[var(--border-hairline)] pb-4">
            <h2 className="font-display text-xl font-bold text-[var(--text-ink)]">
              Account Update &amp; Chanchin Thlakna
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              I profile chanchin hi Zofate Sulhnu archive leh thuziak audit log-ah a lang vek ang.
            </p>
          </div>

          {profileSaveSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>I profile information chu hlawhtling takin save fel a ni e!</span>
            </div>
          )}

          {/* Avatar Icon Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[var(--text-ink)]">
              Thlan tur Avatar (Mizo Cultural Icons)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {MIZO_AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAvatarIcon(opt.icon)}
                  className={`p-3 rounded-2xl text-2xl flex flex-col items-center gap-1 border transition-all ${
                    avatarIcon === opt.icon
                      ? "border-[var(--accent-ink)] bg-[var(--accent-ink)]/15 scale-105 shadow-md"
                      : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="text-[9px] font-ui text-[var(--text-muted)] line-clamp-1">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Contributor Hming
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Hnam Peng (Clan)
              </label>
              <input
                type="text"
                value={clan}
                onChange={(e) => setClan(e.target.value)}
                placeholder="e.g. Lusei - Rokhum, Ralte - Khelte, Lai, Mara"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Khua / Veng (Village / Town)
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Aizawl / Champhai / Khawbung"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Verified Phone (Firebase)
              </label>
              <input
                type="text"
                disabled
                value={profile.phoneNumber || "Not set"}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[var(--bg-canvas)]/50 border border-[var(--border-hairline)] rounded-xl text-[var(--text-muted)] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">
              Chanchin Tawi (Bio / Historical Specialization)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="I chanchin tawi leh i ngaihven bik (e.g. Pi-pu thawnthu, Indo chanchin, DNA thlahtu chhui)..."
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)] resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-ink)] text-[var(--accent-contrast)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Dual Login Setup (Password & Email) */}
      {activeTab === "security" && (
        <form
          onSubmit={handleLinkSecurity}
          className="p-6 sm:p-8 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] space-y-6"
        >
          <div className="border-b border-[var(--border-hairline)] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--accent-ink)] text-[var(--accent-contrast)] uppercase font-semibold">
                Dual Auth
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-ink)] mt-1">
              Password &amp; Email Hmanga Login Siam Chawpna
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Phone SMS OTP bakah, email leh password i siam chawp theih nan hetah hian thlunzawm rawh. Nakinah SMS nghak kher lovin i lut zung zung thei tawh ang.
            </p>
          </div>

          {securityError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{securityError}</span>
            </div>
          )}

          {securityNotice && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{securityNotice}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-ink)]">
                Email Address Thlunzawmna (Link Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. zofate.contributor@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                I email i dah hian email &amp; password hmanga login i duh hunah he email hi i hmang thei ang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-ink)]">
                  Password Siam Chawpna (Set Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-ink)]">
                  Password Chhu Nawn Leh Rawh (Confirm)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSecurity}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-ink)] text-[var(--accent-contrast)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity shadow-md cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSavingSecurity ? "Siam Mek..." : "Password & Email Link Rawh"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Badges Showcase */}
      {activeTab === "badges" && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] space-y-6">
          <div className="border-b border-[var(--border-hairline)] pb-4">
            <h2 className="font-display text-xl font-bold text-[var(--text-ink)]">
              Mizo Archival &amp; Contributor Badges
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Thuziak dik, DNA record thlunzawm, leh thawnthu ziah belhna aṭanga chawimawina dawn theih te.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STANDARD_CONTRIBUTOR_BADGES.map((b) => {
              const isEarned = (profile.badges || []).some((pb) => pb.id === b.id) || b.id === "badge-sulsutu";
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isEarned
                      ? "border-[var(--accent-ink)]/40 bg-[var(--bg-elevated)] shadow-md"
                      : "border-[var(--border-hairline)] bg-[var(--bg-canvas)]/60 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
                      {getBadgeIcon(b.icon)}
                    </div>
                    <span
                      className={`text-[9px] font-code uppercase px-2 py-0.5 rounded-full font-bold ${
                        b.tier === "legendary"
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : b.tier === "gold"
                          ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                          : "bg-stone-500/20 text-stone-300 border border-stone-500/30"
                      }`}
                    >
                      {b.tier}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold mt-3 text-[var(--text-ink)]">
                    {b.titleMizo}
                  </h3>
                  <p className="text-[11px] font-code text-[var(--accent-ink)]">
                    {b.titleEnglish}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] font-code">
                    <span className={isEarned ? "text-emerald-400 font-bold" : "text-stone-500"}>
                      {isEarned ? "✓ Dawn Tawh" : "Dawng Tur"}
                    </span>
                    {isEarned && (
                      <span className="text-[var(--text-muted)]">Active</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Top Contributors (Leaderboard) */}
      {activeTab === "leaderboard" && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] space-y-6">
          <div className="border-b border-[var(--border-hairline)] pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="font-display text-xl font-bold text-[var(--text-ink)]">
                  Top Contributors Leaderboard
                </h2>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Zofate chanchin ziah belh leh record vawng himtu ropui ber berte.
              </p>
            </div>
            <div className="text-xs font-code px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
              5-Star Scale
            </div>
          </div>

          <div className="space-y-3">
            {INITIAL_TOP_CONTRIBUTORS.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:border-[var(--accent-ink)]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-code font-bold text-sm shrink-0 ${
                      c.rank === 1
                        ? "bg-amber-400 text-stone-950 shadow-md"
                        : c.rank === 2
                        ? "bg-stone-300 text-stone-950"
                        : c.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-[var(--bg-canvas)] text-[var(--text-muted)] border border-[var(--border-hairline)]"
                    }`}
                  >
                    #{c.rank}
                  </div>

                  <div className="text-3xl p-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]">
                    {c.avatarIcon}
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-[var(--text-ink)]">
                      {c.displayName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span>{c.clan}</span>
                      <span>•</span>
                      <span>{c.village}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-hairline)]">
                  <div>
                    <p className="text-[10px] font-code uppercase text-[var(--text-muted)]">
                      Rating
                    </p>
                    <div className="mt-0.5">{renderStarRating(c.rating)}</div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-code uppercase text-[var(--text-muted)]">
                      Approved
                    </p>
                    <p className="text-sm font-code font-bold text-[var(--text-ink)]">
                      {c.approvedCount} thawnthu
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-code uppercase text-[var(--text-muted)]">
                      Words Penned
                    </p>
                    <p className="text-sm font-code font-bold text-[var(--accent-ink)]">
                      {c.wordsPenned.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Submissions Review */}
      {activeTab === "submissions" && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] space-y-6">
          <div className="border-b border-[var(--border-hairline)] pb-4">
            <h2 className="font-display text-xl font-bold text-[var(--text-ink)]">
              Ka Thil Thawn Chhinchhiahna (Submission Audit Trail)
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Bung siamthat, DNA record thar, leh lehkha pawimawh i thehluh zawng zawngte dinhmun.
            </p>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="p-10 border border-dashed border-[var(--border-hairline)] rounded-2xl text-center space-y-3">
              <p className="text-4xl">📜</p>
              <h3 className="font-display text-lg font-bold text-[var(--text-ink)]">
                Thil thawn a la awm rih lo
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Lehkhabu chhiarna aṭangin bung edit la, emaw DNA Chain aṭangin thlahtu chanchin theh lut rawh.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions.map((sub) => (
                <article
                  key={sub.id}
                  className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-2xl space-y-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-display text-base font-bold text-[var(--text-ink)]">
                        {sub.sourceName}
                      </h4>
                      <SeverityTag severity={sub.overallSeverity} />
                    </div>
                    <SubmissionStatusTag status={sub.status} />
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    {new Date(sub.submittedAt).toLocaleString()} · Type: {sub.submissionType}
                  </p>

                  <p className="text-xs text-[var(--text-ink)] font-book">
                    {sub.auditReportMizoEnglish}
                  </p>

                  {sub.adminNotes && (
                    <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-xl text-xs">
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
      )}
    </div>
  );
};
