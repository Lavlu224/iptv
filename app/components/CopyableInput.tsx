"use client";

import { useState, useEffect } from "react";

export function CopyableInput({ endpoint }: { endpoint: string }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const fullUrl = mounted ? `${window.location.origin}${endpoint}` : "";

  const handleCopy = async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group/copy cursor-pointer mt-auto pt-4" onClick={handleCopy}>
      <div className="relative flex items-center">
        <input 
          type="text" 
          readOnly 
          value={fullUrl || endpoint} 
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-zinc-400 focus:outline-none group-hover/copy:border-blue-500/50 group-hover/copy:text-blue-200 transition-all cursor-pointer shadow-inner"
        />
        <div className={`absolute right-2 flex items-center justify-center p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-zinc-400 group-hover/copy:bg-blue-500/20 group-hover/copy:text-blue-400'}`}>
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          )}
        </div>
      </div>
      {copied && (
        <div className="absolute -top-8 right-0 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Copied!
        </div>
      )}
    </div>
  );
}
