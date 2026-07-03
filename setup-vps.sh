#!/bin/bash

set -e

echo "=== IPTV Auto Setup for VPS ==="

# 1. Install Node.js + nginx
apt update
apt install -y nodejs npm nginx curl

# 2. Create directory
mkdir -p /var/www/iptv/data
cd /var/www/iptv

# 3. Download all playlist files
for f in bangladeshi fifa sports indian pakistani; do
  curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/app/data/$f.json" -o "data/$f.json"
  curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/app/data/$f.m3u" -o "data/$f.m3u"
done

# 4. Download auto-updater script
curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/scripts/auto-updater.js" -o auto-updater.js

# 5. Configure nginx
cat > /etc/nginx/sites-available/iptv <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/iptv/data;
    index index.html;

    location / {
        add_header Access-Control-Allow-Origin "*";
        add_header Content-Type "application/x-mpegURL" default;
        types {
            application/x-mpegURL m3u;
            application/json json;
        }
    }
}
EOF

ln -sf /etc/nginx/sites-available/iptv /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. Create Toffee cookie refresh script
cat > /var/www/iptv/refresh-toffee.sh <<'SCRIPT'
#!/bin/bash
cd /var/www/iptv
JSON=$(curl -s "https://raw.githubusercontent.com/BINOD-XD/Toffee-Auto-Update-Playlist/main/toffee_channel_data.json")
if [ -n "$JSON" ]; then
  echo "$JSON" | node -e "
    const fs = require('fs');
    const d = JSON.parse(fs.readFileSync('/dev/stdin','utf8'));
    const pk = JSON.parse(fs.readFileSync('data/pakistani.json','utf8'));
    for (const ch of d.channels) {
      const found = pk.find(p => p.name === ch.name);
      if (found && ch.headers && ch.headers.cookie) {
        found.headers.Cookie = ch.headers.cookie;
      }
    }
    fs.writeFileSync('data/pakistani.json', JSON.stringify(pk, null, 4) + '\n');
    console.log('Toffee cookies refreshed');
  "
fi
SCRIPT
chmod +x /var/www/iptv/refresh-toffee.sh

# 7. Cron job (every 30 min)
cat > /etc/cron.d/iptv-update <<'CRON'
*/30 * * * * root cd /var/www/iptv && node auto-updater.js && /var/www/iptv/refresh-toffee.sh && systemctl restart nginx
CRON

echo "Cron installed (every 30 min)"

# 8. Run once immediately
cd /var/www/iptv
node auto-updater.js
bash refresh-toffee.sh

# 9. Get server IP
IP=$(curl -s ifconfig.me)

echo ""
echo "==================================="
echo "  SETUP COMPLETE!"
echo "==================================="
echo ""
echo "Playlist URLs:"
echo ""
echo "  http://$IP/bangladeshi.m3u"
echo "  http://$IP/fifa.m3u"
echo "  http://$IP/sports.m3u"
echo "  http://$IP/indian.m3u"
echo "  http://$IP/pakistani.m3u"
echo ""
echo "Auto-update: every 30 min"
echo "Toffee cookies: auto-refreshed"
echo "==================================="
