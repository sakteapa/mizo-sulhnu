import React, { useState } from "react";
import {
  Phone,
  Mail,
  Lock,
  ShieldCheck,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
} from "lucide-react";
import type { ContributorProfile } from "../types/contributor";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  loginWithEmailPassword,
} from "../services/firebaseAuth";

interface ContributorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: ContributorProfile) => void;
  initialName?: string;
}

export const ContributorAuthModal: React.FC<ContributorAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialName = "",
}) => {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phoneStep, setPhoneStep] = useState<"enter_phone" | "enter_otp">("enter_phone");

  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState("+91 ");
  const [nameInput, setNameInput] = useState(initialName);
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  // Email/Password State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSimulatedNotice(null);

    const clean = phoneNumber.trim().replace(/\s+/g, "");
    if (clean.length < 10) {
      setErrorMessage("Phone number dik tawk lo a ni. (+91 9876543210 ang chhu lut rawh)");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPhoneOtp(clean, "recaptcha-container");
      if (res.success) {
        setVerificationId(res.verificationId);
        setPhoneStep("enter_otp");
        setSuccessMessage(res.message);
        if (res.simulatedOtp) {
          setSimulatedNotice(`[Firebase Test OTP]: ${res.simulatedOtp}`);
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "SMS thawn theih a ni lo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.trim().length < 6) {
      setErrorMessage("OTP code digit 6 chhut luh tur a ni.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPhoneOtp(verificationId, otpCode, nameInput);
      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "OTP verify theih a ni lo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMessage("Email leh Password chhu lut vek rawh.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithEmailPassword(emailInput, passwordInput);
      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Login a hlawhtling lo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contributor Firebase Authentication"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Recaptcha hidden container */}
        <div id="recaptcha-container"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-code px-2 py-0.5 rounded bg-[var(--accent-ink)] text-[var(--accent-contrast)] uppercase font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Firebase Auth
              </span>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-muted)] border border-[var(--border-hairline)]">
                Contributor Portal
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-ink)]">
              Contributor Login
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
              Reader tan login a ngai lo va, lehkha chhiar a zalen vek e. Contributor-te chauhin thuziak leh DNA chanchin thehluh nan in-verify a ngai a ni.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Khâr rawh"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)] rounded-lg hover:bg-[var(--bg-canvas)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Phone OTP vs Email/Password */}
        <div className="flex rounded-lg bg-[var(--bg-canvas)] p-1 border border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => {
              setAuthMode("phone");
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
              authMode === "phone"
                ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone SMS OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("email");
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
              authMode === "email"
                ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email &amp; Password</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {simulatedNotice && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-code flex items-center justify-between">
            <span>{simulatedNotice}</span>
            <button
              type="button"
              onClick={() => {
                const match = simulatedNotice.match(/\d{6}/);
                if (match) setOtpCode(match[0]);
              }}
              className="text-[11px] underline hover:text-white"
            >
              Autofill
            </button>
          </div>
        )}

        {/* Form: Phone Number + SMS OTP */}
        {authMode === "phone" && (
          <div>
            {phoneStep === "enter_phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">
                    Contributor Hming (I hming pumpui)
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Lalmuanpuia Ralte"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">
                    Phone Number (Country code nen)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Firebase authentication-in SMS hmangin OTP 6-digit a rawn thawn ang.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-ink)] text-[var(--accent-contrast)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <span>SMS Thawn Mek A Ni...</span>
                  ) : (
                    <>
                      <span>SMS OTP Thawn Rawh</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-[var(--text-muted)]">
                      SMS OTP Code (Digit 6)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep("enter_phone")}
                      className="text-[11px] text-[var(--accent-ink)] hover:underline"
                    >
                      Phone Number thlakna
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      autoFocus
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-center text-lg font-mono tracking-widest bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    I phone-ah OTP a la thleng lo a nih chuan 'Phone number thlakna' hmetin check nawn leh rawh.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-ink)] text-[var(--accent-contrast)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <span>Verify Mek A Ni...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Contributor In Lut Rawh</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Form: Email & Password (for existing linked accounts) */}
        {authMode === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="i_email@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                I dashboard aṭanga i lo siam tawh password chhu lut rawh. A la nei lo tan Phone SMS OTP hmangin a luh theih reng e.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-ink)] text-[var(--accent-contrast)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <span>Login Mek A Ni...</span>
              ) : (
                <>
                  <span>Email Hmangin Lut Rawh</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="p-3 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-hairline)] flex items-center gap-2.5 text-[11px] text-[var(--text-muted)]">
          <Sparkles className="w-4 h-4 text-[var(--accent-ink)] shrink-0" />
          <span>
            Phone OTP hmanga i luh zawhah i Contributor Profile Dashboard-ah Email leh Password i thlunzawm chawp thei ang.
          </span>
        </div>
      </div>
    </div>
  );
};
