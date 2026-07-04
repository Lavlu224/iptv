param(
    [switch]$TestAlive
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

function Write-Log { param($Msg) Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Msg" }

function Test-UrlAlive {
    param($Url)
    try {
        $req = [System.Net.WebRequest]::Create($Url)
        $req.Method = "GET"
        $req.Timeout = 6000
        $resp = $req.GetResponse()
        $status = [int]$resp.StatusCode
        $resp.Close()
        return ($status -ge 200 -and $status -lt 400)
    } catch { return $false }
}

function Remove-DeadUrls {
    param($Lines)
    $out = @($Lines[0])
    $i = 1
    while ($i -lt $Lines.Count) {
        if ($Lines[$i] -match '#EXTINF:') {
            $url = $Lines[$i+1]
            if ($url -match '^https?://') {
                Write-Host "  Testing ... " -NoNewline
                $alive = Test-UrlAlive $url
                if ($alive) { Write-Host "ALIVE" -ForegroundColor Green; $out += $Lines[$i]; $out += $url }
                else { Write-Host "DEAD" -ForegroundColor Red }
                $i += 2
            } else { $out += $Lines[$i]; $i++ }
        } else { $out += $Lines[$i]; $i++ }
    }
    return $out
}

# ============================================================
# 1. FETCH FROM IMSHAKIL/TVLINK → Indian channels
# ============================================================
Write-Log "Fetching from imShakil/tvlink..."
try {
    $r = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/imShakil/tvlink/refs/heads/main/iptv.m3u8" -TimeoutSec 20 -UseBasicParsing
    $lines = $r.Content -split "`r`n|`n"

    $indianKeywords = @(
        "Zee Bangla Cinema","Colors Bangla Cinema","Colors Cineplex","Colors Infinity","Star Movies",
        "Star News","ABP Ananda","Zee 24 Ghanta","News18 Bangla","Zee Anmol","Zee Action",
        "B4U Kadak","B4U Movies","B4U Music","Star Sports 1 HD","Nat Geo HD","9XM",
        "BuddyStar HD","DD Bangla","NDTV NEWS","NDTV English","NDTV Hindi","DD Sports 2.0",
        "Star Plus","Colors HD","Zee TV","Star Bharat","Star Gold","Star Maa HD",
        "Star Sports 1 Hindi","Zee Bangla Sonar","Aaj Tak","Republic TV","WION",
        "Star Jalsha","Colors Bangla","Zee Bangla","Zee Cinema","And TV","Dangal",
        "Sony Aath","Sony Kal","Sony Max","Sony Pal","Sony Sab","Sony TV",
        "Sony Sports Ten","History TV","MU | 9XM","Sun Bangla","Enter 10 Bangla",
        "Jalsha Movies","Sangeet Bangla","Khushboo Bangla","R Plus","Calcutta News",
        "Kolkata TV","TV9 Bangla","Gopal Bhar","Motu Patlu","Discovery Bangla",
        "BBC Earth","Food Food","Rongeen TV","YRF Music","Hindi Hits","9X Jalwa",
        "8XM","Music India","Cineedge","Uniques","Superrix","Bangla Vision",
        "Flash Guys","Luxel","Funny Junior","Sports Legends","Sports Range",
        "Fighters","Smarty","Lucky Family","Kids Stars","Party Universe",
        "Originals","Crazy Ex","Delicious","Deepto TV","ATN Bangla","Ekushey TV",
        "NTV","Jamuna","Independent TV","Ekattor","Channel 24","ATN News",
        "Channel 9","Channel I","Islamic TV","Nagorik","Maasranga","RTV",
        "SATV","Mohona","Desh TV","Asian TV","Bangla TV","Channel S","SRK TV"
    )

    $output = @("#EXTM3U"); $seen = @{}
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '#EXTINF:') {
            $name = ($lines[$i] -split ',')[-1].Trim()
            $match = $false
            foreach ($kw in $indianKeywords) {
                if ($name -match [regex]::Escape($kw)) { $match = $true; break }
            }
            if ($match -and $i+1 -lt $lines.Count -and $lines[$i+1] -match '^https?://' -and -not $seen.ContainsKey($name)) {
                $seen[$name] = $true
                $output += $lines[$i]
                $output += $lines[$i+1]
            }
        }
    }

    $file = Join-Path $repoRoot "app/data/imshakil_indian.m3u8"
    Set-Content -Path $file -Value ($output -join "`r`n") -Encoding UTF8
    Write-Log "✅ imshakil_indian.m3u8 → $(($output|Where-Object{$_ -match '#EXTINF:'}).Count) channels"
}
catch { Write-Log "❌ imShakil fetch failed: $_" }

# ============================================================
# 2. FETCH FROM IPTV-ORG/IPTV → FIFA / Bangladeshi sports
# ============================================================
Write-Log "Fetching from iptv-org (BD streams)..."
try {
    $r = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/bd.m3u" -TimeoutSec 20 -UseBasicParsing
    $lines = $r.Content -split "`r`n|`n"

    $fifaKeywords = @("T Sports","BTV","Somoy","Gazi TV","GTV")
    $output = @("#EXTM3U"); $seen = @{}
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '#EXTINF:') {
            $name = ($lines[$i] -split ',')[-1].Trim()
            $match = $false
            foreach ($kw in $fifaKeywords) { if ($name -match [regex]::Escape($kw)) { $match = $true; break } }
            if ($match -and $i+1 -lt $lines.Count -and $lines[$i+1] -match '^https?://') {
                if (-not $seen.ContainsKey($name)) { $seen[$name] = $true; $output += $lines[$i]; $output += $lines[$i+1] }
            }
        }
    }

    # Also add T Sports from imShakil
    try {
        $r2 = Invoke-WebRequest -Uri "https://raw.githubusercontent.com/imShakil/tvlink/refs/heads/main/iptv.m3u8" -TimeoutSec 15 -UseBasicParsing
        $lines2 = $r2.Content -split "`r`n|`n"
        for ($i = 0; $i -lt $lines2.Count; $i++) {
            if ($lines2[$i] -match '#EXTINF:' -and $lines2[$i] -match '(?i)tsports|T Sports') {
                $name = ($lines2[$i] -split ',')[-1].Trim()
                if ($i+1 -lt $lines2.Count -and $lines2[$i+1] -match '^https?://' -and -not $seen.ContainsKey($name)) {
                    $seen[$name] = $true; $output += $lines2[$i]; $output += $lines2[$i+1]
                }
            }
        }
    } catch { }

    # Also add ARABIC LIVE (beIN Sports)
    $output += '#EXTINF:-1 tvg-logo="" group-title="FIFA",ARABIC LIVE'
    $output += 'https://live-aburayhan1111.telewebion.ir/ek/sport1/live/720p/index.m3u8'

    $file = Join-Path $repoRoot "app/data/fifa.m3u"
    Set-Content -Path $file -Value ($output -join "`r`n") -Encoding UTF8
    Write-Log "✅ fifa.m3u → $(($output|Where-Object{$_ -match '#EXTINF:'}).Count) channels"
}
catch { Write-Log "❌ iptv-org fetch failed: $_" }

# ============================================================
# 3. OPTIONAL: Test liveness and remove dead
# ============================================================
if ($TestAlive) {
    Write-Log "Testing channel liveness..."
    foreach ($file in @("imshakil_indian.m3u8", "fifa.m3u")) {
        $path = Join-Path $repoRoot "app/data/$file"
        $content = Get-Content -Path $path
        $cleaned = Remove-DeadUrls $content
        Set-Content -Path $path -Value ($cleaned -join "`r`n") -Encoding UTF8
        Write-Log "✅ $file cleaned → $(($cleaned|Where-Object{$_ -match '#EXTINF:'}).Count) channels alive"
    }
}

Write-Log "Done! Channels auto-updated from source repos."