import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl py-10 mt-16">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900 border border-white/5 p-0.5">
            <Image 
              src="/logo.svg" 
              alt="IPTV Sync Hub Logo" 
              width={20} 
              height={20}
            />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">IPTV PLAYLIST SERVER</span>
        </div>
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} IPTV Sync Hub. All rights reserved. &rarr; S. SHAJON
        </p>
        <div className="flex gap-6">
          <Link href="/faq" className="text-xs text-zinc-400 hover:text-white transition-colors">DMCA Policy</Link>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Playlists</Link>
        </div>
      </div>
    </footer>
  );
}
