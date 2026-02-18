
$g_path = "G:\Spectrasonics\STEAM"
$c_path = "C:\ProgramData\Spectrasonics\STEAM_BACKUP"

Write-Host "Calculating G: size..."
$g_size = (Get-ChildItem $g_path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
Write-Host "G: Size: $([math]::round($g_size/1GB, 2)) GB"

Write-Host "Calculating C: Backup size..."
$c_size = (Get-ChildItem $c_path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
Write-Host "C: Backup Size: $([math]::round($c_size/1GB, 2)) GB"

if ($g_size -eq $c_size) {
    Write-Host "SUCCESS: Sizes match perfectly." -ForegroundColor Green
}
else {
    $diff = [math]::abs($g_size - $c_size) / 1MB
    Write-Host "WARNING: Sizes differ by $([math]::round($diff, 2)) MB" -ForegroundColor Yellow
}
