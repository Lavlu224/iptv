import fs from 'fs/promises';
import path from 'path';
import { PlaylistTabs } from './components/PlaylistTabs';

export default async function Home() {
  const dataDir = path.join(process.cwd(), 'app', 'data');
  const files: { name: string; updated: string; size: number }[] = [];

  try {
    const dirEntries = await fs.readdir(dataDir);
    for (const file of dirEntries) {
      if (file.endsWith('.json') || file.endsWith('.m3u')) {
        const stat = await fs.stat(path.join(dataDir, file));
        files.push({
          name: file,
          updated: stat.mtime.toISOString(), // Must serialize Date for client components
          size: stat.size,
        });
      }
    }
  } catch (error) {
    console.error('Failed to read data dir:', error);
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-6xl flex flex-col justify-center">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-2">
          <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">Live Synchronization</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
          Available Playlists
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
          Copy these dynamic URLs directly into your favorite IPTV player to keep your streams in sync.
        </p>
      </div>

      {/* Dynamic tabs and filters */}
      <PlaylistTabs files={files} />
    </main>
  );
}
