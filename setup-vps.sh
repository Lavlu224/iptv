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
for f in fifa akash; do
  curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/app/data/$f.json" -o "data/$f.json"
  curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/app/data/$f.m3u" -o "data/$f.m3u"
done

# 4. Download scripts
curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/scripts/auto-updater.js" -o auto-updater.js
curl -sL "https://raw.githubusercontent.com/Lavlu224/iptv/main/scripts/json-to-m3u.js" -o json-to-m3u.js

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

# 7. Cron job (every 30 min)
cat > /etc/cron.d/iptv-update <<'CRON'
*/30 * * * * root cd /var/www/iptv && node auto-updater.js && systemctl restart nginx
CRON

echo "Cron installed (every 30 min)"

# 8. Run once immediately
cd /var/www/iptv
node auto-updater.js
# 9. Get server IP
IP=$(curl -s ifconfig.me)

echo ""
echo "==================================="
echo "  SETUP COMPLETE!"
echo "==================================="
echo ""
echo "Playlist URLs:"
echo ""
echo "  http://$IP/fifa.m3u"
echo "  http://$IP/akash.m3u"
echo ""
echo "Total channels:"
for f in /var/www/iptv/data/*.m3u; do
  name=$(basename "$f" .m3u)
  count=$(grep -c '#EXTINF' "$f")
  echo "  $name: $count channels"
done
echo ""
echo "Auto-update: every 30 min"
echo "==================================="
