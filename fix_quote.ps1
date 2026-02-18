$path = "c:\Users\matsu\.gemini\antigravity\scratch\QS\plugins_db.js"
$lines = [System.IO.File]::ReadAllLines($path)
$count = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "Tracktion" -and $lines[$i] -match "em'") {
        $lines[$i] = "{n:'F.em',m:'Tracktion',c:'インストゥルメント',a:'独自認証',u:'https://www.tracktion.com/',dl:''},"
        Write-Host "Fixed line $($i+1): $($lines[$i])"
        $count++
    }
}
[System.IO.File]::WriteAllLines($path, $lines)
Write-Host "Done - fixed $count lines"
