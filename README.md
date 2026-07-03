# 🌍 IPTV Playlists Hub

This repository hosts a curated collection of lightweight IPTV channel databases and serves them via a Next.js API web server. It provides the playlists in both structured **JSON** and standard **M3U** formats, compatible with the [IPTV Player](https://github.com/SHAJON-404/iptv) project.

---

## 📺 Synchronized API Endpoints (Live Server)

When the server is running, you can access your dynamically compiled playlists using the following local or deployed API routes:

* **Fifa World Cup**: `/playlist/fifa.json` | `/playlist/fifa.m3u`
* **Sports Channel List**: `/playlist/sports.json` | `/playlist/sports.m3u`
* **Universal Channel List**: `/playlist/channels.json` | `/playlist/channels.m3u`
* **Bangla Channel List**: `/playlist/bangla.json` | `/playlist/bangla.m3u`

---

## 🔗 Raw GitHub CDN Playlists (Fallback)

If you prefer to load files directly from GitHub's CDN without running the web server:

### 🏆 Sports Playlist (240+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/sports.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/sports.m3u`

### 🌍 Universal Playlist (7500+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/channels.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/channels.m3u`

### 🇧🇩 Bangla Playlist (100+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/bangla.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/bangla.m3u`

### ⚽ FIFA Playlist (10+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/fifa.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/fifa.m3u`

---

## 🚀 Getting Started

To run the Next.js playlist sync server locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file:
```env
ALLOWED_DEV_ORIGINS=http://localhost:3000,https://live.shajon.dev
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### 4. Production Build & Linting
```bash
npm run lint
npm run build
```

---

## ⚙️ JSON to M3U Playlist Converter

The repository includes a Node.js utility script that automatically scans and parses all JSON files inside the `app/data` directory and converts them to standard `.m3u` playlists:

```bash
# Convert all JSON files in app/data
node scripts/json-to-m3u.js

# Convert a specific file
node scripts/json-to-m3u.js app/data/fifa.json app/data/fifa.m3u
```

---

## ⚙️ Automated Quality Checker & Updates

This repository features an automated checking and validation workflow to ensure playlist stream links stay active and up-to-date.

### 1. Stream Quality Checker
The `scripts/get_qualities.js` script fetches and parses channels from a source `.json` or `.m3u` file, verifies if the streams are alive, extracts their available video resolutions (for HLS and DASH), and writes the valid streams to `app/data/fifa.json`. All invalid and dead streams are automatically discarded.

Run the quality checker manually:
```bash
npm run get-qualities channel_data/all_sports_channel.json
```

### 2. GitHub Actions Cron Workflow
A GitHub Action is configured at `.github/workflows/update_channels.yml` to automate checking:
* Runs **every hour** automatically.
* Checks stream statuses in `channel_data/all_sports_channel.json`.
* Saves only the valid/live streams directly to `app/data/fifa.json`.
* Automatically runs the JSON to M3U converter to compile standard playlists.
* Commits and pushes any updates to GitHub using a professional commit message (`chore: auto-update channel playlists [skip ci]`).

---
## ❤️ Credits

Special thanks to all IPTV open-source repository maintainers and contributors whose publicly available playlists and stream sources make this collection and player possible.

---

## ⚠️ Disclaimer & DMCA Policy

This repository does not host, store, retransmit, or own any television channels or media content. The JSON files and M3U playlists only reference publicly available stream links collected from open-source IPTV playlists and public internet sources. Channel availability may change, expire, or stop working at any time.

For any DMCA takedown requests, please create a new issue on the [GitHub Issues](https://github.com/SHAJON-404/iptv-playlist/issues) tracker or contact the developer directly. Once verified, the reported channel will be deleted from the `.m3u`/`.json` sources instantly.

> [!IMPORTANT]
> **License & Credit Notice**: If you use this channel database or stream source list in your own projects, you **must share and display proper credit** to the original developer (**S. SHAJON**) along with a link back to this repository.
