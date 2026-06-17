# 🌍 IPTV Playlists Database

This repository hosts a curated collection of lightweight IPTV channel databases used by the [IPTV Player](https://github.com/SHAJON-404/iptv) project. The channels are provided in both **JSON** and standard **M3U** formats.

## 📺 Playlists Available

You can use these raw links in any media player, Android TV, or your own projects:

### 🏆 Sports Playlist (240+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/sports.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/sports.m3u`

### 🌍 Universal Playlist (7500+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/channels.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/channels.m3u`

### 🇧🇩 Bangla Playlist (100+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/bangla.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/bangla.m3u`

### ⚽ FIFA Playlist (10+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/fifa.json`
* **M3U Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/data/fifa.m3u`

## ⚙️ M3U Playlist Converter

The repository includes a built-in Node.js converter script that automatically scans and parses all JSON files in the `data` directory and outputs standard M3U playlists.

### Usage
```bash
node scripts/json-to-m3u.js
```

## ⚠️ Disclaimer

This repository does not host, store, retransmit, or own any television channels or media content. The JSON files and M3U playlists only reference publicly available stream links collected from open-source IPTV playlists and public internet sources. Channel availability may change, expire, or stop working at any time.

> [!IMPORTANT]
> **License & Credit Notice**: If you use this channel database or stream source list in your own projects, you **must share and display proper credit** to the original developer (**S. SHAJON**) along with a link back to this repository.
