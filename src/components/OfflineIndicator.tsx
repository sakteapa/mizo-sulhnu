import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export const OfflineIndicator: React.FC = () => {
  const { isOnline, justReconnected } = useOnlineStatus();

  if (isOnline && !justReconnected) return null;

  if (!isOnline) {
    return (
      <div
        role="status"
        className="no-print fixed bottom-20 md:bottom-4 left-4 right-4 sm:right-auto z-50 inline-flex items-center gap-2 rounded-md border border-amber-700/40 bg-amber-800 px-3.5 py-2 text-xs font-medium text-amber-50 shadow-lg"
      >
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
        <span>
          Offline Mode — Lehkhabu chhiar, draft ziah leh DNA Chain hman theih a ni (AI features tan Internet a ngai).
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="no-print fixed bottom-20 md:bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-md border border-emerald-700/40 bg-emerald-800 px-3.5 py-2 text-xs font-medium text-emerald-50 shadow-lg"
    >
      <Wifi className="w-3.5 h-3.5 shrink-0" />
      <span>Online leh ta — Gemini AI Watchdog leh Generator hman theih a ni e.</span>
    </div>
  );
};
