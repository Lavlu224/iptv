import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="relative z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all bg-zinc-955 border border-white/10 p-0.5">
            <Image 
              src="/logo.svg" 
              alt="IPTV Sync Hub Logo" 
              width={32} 
              height={32}
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white leading-none">IPTV PLAYLIST</span>
            <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mt-1">Sync Server</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SHAJON-404/iptv-playlist"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <Link 
            href="/faq" 
            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            FAQ
          </Link>
        </div>
      </div>
    </header>
  );
}
