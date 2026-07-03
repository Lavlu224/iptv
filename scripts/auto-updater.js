const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const DATA_DIR = path.join(__dirname, '../app/data');
const TIMEOUT = 10000;
const MAX_RETRIES = 2;

const SOURCE_PLAYLISTS = [
  'https://raw.githubusercontent.com/imShakil/tvlink/main/iptv.m3u8',
  'https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/channels.m3u',
  'https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/fifa.m3u',
  'https://raw.githubusercontent.com/ARAbdulla-Dev2/iptv-host/main/FiFa%202026.m3u8',
  'https://raw.githubusercontent.com/ahan443/FAST-IPTV/main/FIFA.m3u',
];

const CHANNEL_ALT_SOURCES = {
  'BTV': [
    'http://198.195.239.50:8095/btv/tracks-v1a1/mono.m3u8',
    'https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8',
    'https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/1709.m3u8',
  ],
  'T Sports': [
    'http://198.195.239.50:8095/tsports/tracks-v1a1/mono.m3u8',
    'http://198.195.239.50:8095/Tsports/tracks-v1a1/mono.m3u8',
  ],
  'Somoy TV': [
    'http://198.195.239.50:8095/somoyTv/tracks-v1a1/mono.m3u8',
    'https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8',
    'https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/1702.m3u8',
    'https://live.thebosstv.com:30443/dwlive/Somoy-TV/playlist.m3u8',
  ],
  'ARABIC LIVE': [
    'https://live-aburayhan1111.telewebion.ir/ek/sport1/live/720p/index.m3u8',
  ],
};

function fetchUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      method: 'GET',
      timeout: TIMEOUT,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': '*/*' },
    }, (res) => {
      res.resume();
      res.on('data', () => {});
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function isAlive(url) {
  for (let r = 0; r <= MAX_RETRIES; r++) {
    if (r > 0) await new Promise(r => setTimeout(r, 2000));
    const ok = await fetchUrl(url);
    if (ok) return true;
  }
  return false;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchText(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT }, (res) => {
      if (res.statusCode !== 200) { resolve(''); return; }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function parseM3U(text) {
  const result = [];
  let current = null;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('#EXTINF:')) {
      current = {};
      const m = t.match(/,([^,]+)$/);
      if (m) current.name = m[1].trim();
    } else if (current && t && !t.startsWith('#') && !t.startsWith('http')) {
      current.url = t;
      result.push(current);
      current = null;
    } else if (current && t && !t.startsWith('#')) {
      current.url = t;
      result.push(current);
      current = null;
    }
  }
  return result;
}

function nameExact(a, b) {
  return a.toLowerCase().trim() === b.toLowerCase().trim();
}

function nameSimilar(a, b) {
  const x = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const y = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  return x === y;
}

async function findReplacement(channelName, oldUrl) {
  // Check predefined alt sources first
  const alts = CHANNEL_ALT_SOURCES[channelName] || CHANNEL_ALT_SOURCES[channelName.replace(/\s+HD$/i, '')];
  if (alts) {
    for (const alt of alts) {
      if (alt === oldUrl) continue;
      if (await isAlive(alt)) return alt;
    }
  }

  // Fetch source playlists and search with exact name match
  for (const srcUrl of SOURCE_PLAYLISTS) {
    await sleep(800);
    const data = await fetchText(srcUrl);
    if (!data) continue;

    const entries = parseM3U(data);
    for (const entry of entries) {
      if (!entry.url || entry.url === oldUrl) continue;

      // Try exact match first
      if (nameExact(entry.name, channelName)) {
        if (await isAlive(entry.url)) return entry.url;
      }
    }

    // Second pass: try similar match
    for (const entry of entries) {
      if (!entry.url || entry.url === oldUrl) continue;
      if (nameSimilar(entry.name, channelName)) {
        if (await isAlive(entry.url)) return entry.url;
      }
    }
  }

  return null;
}

async function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const channels = JSON.parse(raw);
  if (!Array.isArray(channels)) return false;

  let changed = false;

  for (let i = 0; i < channels.length; i++) {
    const ch = channels[i];
    if (!ch.url) continue;

    process.stdout.write(`[${i + 1}/${channels.length}] ${ch.name}... `);

    const alive = await isAlive(ch.url);
    if (alive) {
      console.log('OK');
      continue;
    }

    console.log('DEAD');
    const replacement = await findReplacement(ch.name, ch.url);
    if (replacement) {
      ch.url = replacement;
      changed = true;
      console.log(`  -> REPLACED: ${replacement}`);
    } else {
      console.log('  -> no valid replacement found');
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(channels, null, 4) + '\n', 'utf8');
    console.log(`  => ${path.basename(filePath)} updated`);
  }

  return changed;
}

async function main() {
  console.log('='.repeat(70));
  console.log('IPTV Auto-Updater');
  console.log('='.repeat(70));

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`ERROR: ${DATA_DIR} not found`);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && f !== 'channels.json')
    .sort();

  let anyChanged = false;

  for (const file of files) {
    console.log(`\n>>> ${file}`);
    const ok = await processFile(path.join(DATA_DIR, file));
    if (ok) anyChanged = true;
  }

  if (anyChanged) {
    console.log('\n--- Converting JSON to M3U ---');
    require('./json-to-m3u.js');
  }

  console.log('\n' + '='.repeat(70));
  console.log(anyChanged ? 'DONE: Updates applied.' : 'DONE: All channels OK.');
  console.log('='.repeat(70));
}

main();
