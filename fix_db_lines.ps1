$path = "c:\Users\matsu\.gemini\antigravity\scratch\QS\plugins_db.js"
$lines = [System.IO.File]::ReadAllLines($path)
$fixed = $false
for ($i = 0; $i -lt $lines.Length; $i++) {
    // Fix line 967 (Tracktion F.'em encoding issue)
    if ($lines[$i] -match "Tracktion" -and $lines[$i] -match "F\.") {
        $lines[$i] = "    { n: 'F.em', m: 'Tracktion', c: 'インストゥルメント', a: '独自認証', u: 'https://www.tracktion.com/', dl: '' },"
        Write-Host "Fixed line $($i+1)"
        $fixed = $true
    }
    // Fix line 1892 (Tracktion F.'em syntax error)
    if ($lines[$i] -match "F\.'em") {
        $lines[$i] = "    { n: 'F.em', m: 'Tracktion', c: 'インストゥルメント', a: '独自認証', u: 'https://www.tracktion.com/', dl: '' },"
        Write-Host "Fixed line $($i+1)"
        $fixed = $true
    }
}
if ($fixed) {
    [System.IO.File]::WriteAllLines($path, $lines)
    Write-Host "Detailed fixes applied."
}
else {
    Write-Host "No lines matched for fixing."
}
