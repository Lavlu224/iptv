const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '../app/data');
const TOFFEE_JSON = path.join(DATA_DIR, 'toffee.json');
const TOFFEE_M3U = path.join(DATA_DIR, 'toffee.m3u');
const BINOD_URL = 'https://raw.githubusercontent.com/BINOD-XD/Toffee-Auto-Update-Playlist/main/toffee_channel_data.json';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, res => {
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

function generateM3U(channels) {
  const lines = ['#EXTM3U'];
  for (const ch of channels) {
    if (!ch.url) continue;
    let extinf = '#EXTINF:-1';
    if (ch.logo) extinf += ` tvg-logo="${ch.logo}"`;
    if (ch.group) extinf += ` group-title="${ch.group}"`;
    extinf += `,${ch.name || 'Unknown'}`;
    lines.push(extinf);
    lines.push(ch.url);
  }
  return lines.join('\n') + '\n';
}

async function main() {
  console.log('[Toffee Refresh] Fetching latest cookies from BINOD-XD...');

  const data = await fetchJSON(BINOD_URL);
  const freshChannels = data.channels || [];
  if (!freshChannels.length) {
    console.log('[Toffee Refresh] No channels found, skipping');
    return;
  }

  const oldJson = JSON.parse(fs.readFileSync(TOFFEE_JSON, 'utf8'));
  let changed = 0;

  for (const fresh of freshChannels) {
    const match = oldJson.find(c => c.name === fresh.name);
    if (match) {
      const newCookie = fresh.headers?.cookie || '';
      if (newCookie && match.headers && match.headers.Cookie !== newCookie) {
        match.headers.Cookie = newCookie;
        changed++;
      }
    }
  }

  if (changed > 0) {
    fs.writeFileSync(TOFFEE_JSON, JSON.stringify(oldJson, null, 4) + '\n', 'utf8');
    const m3u = generateM3U(oldJson);
    fs.writeFileSync(TOFFEE_M3U, m3u, 'utf8');
    console.log(`[Toffee Refresh] ${changed} cookies updated, M3U regenerated`);
  } else {
    console.log('[Toffee Refresh] No cookie changes needed');
  }

  // Also update pakistani.json (Hum TV, Hum Masala, Hum Sitarey)
  const pkPath = path.join(DATA_DIR, 'pakistani.json');
  if (fs.existsSync(pkPath)) {
    const pk = JSON.parse(fs.readFileSync(pkPath, 'utf8'));
    let pkChanged = false;
    for (const fresh of freshChannels) {
      const match = pk.find(c => c.name === fresh.name);
      if (match && match.headers) {
        const newCookie = fresh.cookie || fresh.headers?.Cookie || '';
        if (newCookie && match.headers.Cookie !== newCookie) {
          match.headers.Cookie = newCookie;
          pkChanged = true;
        }
      }
    }
    if (pkChanged) {
      fs.writeFileSync(pkPath, JSON.stringify(pk, null, 4) + '\n', 'utf8');
      console.log('[Toffee Refresh] Pakistani JSON cookies updated');
    }
  }
}

main().catch(err => {
  console.error('[Toffee Refresh] Error:', err.message);
  process.exit(1);
});
