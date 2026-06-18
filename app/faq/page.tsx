export default function FAQ() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl flex flex-col min-h-[80vh]">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
          <span className="text-sm font-medium text-zinc-300">Information</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Find answers to common questions, guidelines, and our DMCA policy.
        </p>
      </div>

      <div className="space-y-6">
        {/* DMCA Notice */}
        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/20 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-white">DMCA & Copyright Information</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-6">
              We respect the intellectual property rights of others. This project merely aggregates public, free-to-air links found on the internet. We do not host, store, or stream any media files ourselves.
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">How to file a takedown request?</h3>
              <p className="text-zinc-400 mb-4">
                If you believe a channel or link violates your copyright, please create an issue on our GitHub repository or contact the developer directly. Once you contact us with valid proof:
              </p>
              <ul className="space-y-3 mb-6 text-zinc-300">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                  We will instantly review the request.
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                  The reported channel will be immediately removed from the `.m3u` and `.json` playlists.
                </li>
              </ul>
              <a 
                href="https://github.com/SHAJON-404/iptv-playlist/issues/new" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Create an Issue on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* General FAQs */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-3">How do I use these playlists?</h3>
            <p className="text-zinc-400">
              Simply copy the URL of the `.m3u` or `.json` file from the main page and paste it into your favorite IPTV player (like VLC, Tivimate, or our custom web player).
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-3">How often is the list updated?</h3>
            <p className="text-zinc-400">
              We regularly scan and verify channels. You can see the exact &quot;Last updated&quot; time for each playlist directly on the homepage. Changes are pushed automatically.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-3">Why is a channel buffering?</h3>
            <p className="text-zinc-400">
              Since these are public free streams, they might experience heavy load or geographic restrictions. Try playing the stream later, or use a VPN if it&apos;s geo-blocked.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-3">What formats are supported?</h3>
            <p className="text-zinc-400">
              We support both traditional `M3U` formats for general players and structured `JSON` files for specialized modern players and custom integrations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
