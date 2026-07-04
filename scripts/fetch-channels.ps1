param(
    [switch]$TestAlive
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot | Split-Path -Parent

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

    $indianNames = @{
        "Zee Bangla Cinema"=$true; "Colors Bangla Cinema"=$true; "Colors Cineplex HD"=$true
        "Colors Infinity HD"=$true; "Star Movies HD"=$true; "Star Movies Select HD"=$true
        "Star News"=$true; "ABP Ananda"=$true; "Zee 24 Ghanta"=$true; "News18 Bangla News"=$true
        "Zee Anmol TV"=$true; "Zee Action"=$true; "Zee Anmol Cinema"=$true; "B4U Kadak"=$true
        "B4U Movies"=$true; "B4U Music"=$true; "Star Sports 1 HD"=$true; "Nat Geo HD"=$true
        "9XM"=$true; "BuddyStar HD"=$true; "DD Bangla"=$true; "NDTV NEWS"=$true
        "NDTV English"=$true; "NDTV Hindi"=$true; "DD Sports 2.0"=$true; "StarPlus"=$true
        "Star Plus HD"=$true; "Zee TV HD"=$true; "Colors HD"=$true; "Star Bharat"=$true
        "Star Gold 2"=$true; "Star Gold Romance"=$true; "Star Gold Select HD"=$true
        "Star Gold Thrills"=$true; "Star Maa HD"=$true; "Star Sports 1 Hindi HD"=$true
        "Zee Bangla Sonar"=$true; "Aaj Tak"=$true; "Republic TV"=$true; "WION"=$true
        "Star Jalsha HD"=$true; "Colors Bangla HD"=$true; "Zee Bangla HD"=$true
        "Zee Cinema HD"=$true; "&TV HD"=$true; "Dangal TV"=$true; "Dangal 2"=$true
        "Colors Bangla"=$true; "Sony Aath"=$true; "Sony Kal"=$true; "Sony Max"=$true
        "Sony Max 2 HD"=$true; "Sony Pal"=$true; "Sony Sab"=$true
        "Sony Sports Ten 2 HD"=$true; "Sony Sports Ten 3 HD"=$true; "Sony TV"=$true
        "Sony TV HD"=$true; "Star Gold"=$true; "Star Gold HD"=$true; "Star Jalsha"=$true
        "Star Movies"=$true; "Star Plus"=$true; "Zee Cinema"=$true; "Zee TV"=$true
        "Colors Cineplex"=$true; "Colors"=$true; "History TV 18"=$true; "MU | 9XM"=$true
    }

    $output = @("#EXTM3U"); $seen = @{}; $skip = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '#EXTINF:') {
            $name = ($lines[$i] -split ',')[-1].Trim()
            $skip = -not $indianNames.ContainsKey($name)
        }
        elseif ($lines[$i] -match '^https?://' -and -not $skip) {
            $name = ($output[-1] -split ',')[-1].Trim()
            if (-not $seen.ContainsKey($name)) { $seen[$name] = $true; $output += $output[-1]; $output[-2] = $lines[$i] }
            else { $output = $output[0..($output.Count-2)] }
            $skip = $false
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