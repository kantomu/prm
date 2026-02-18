
# 移行状況確認スクリプト

$srcSizeGB = 105.0
$dstPath = "G:\Spectrasonics\STEAM"

while ($true) {
    Clear-Host
    Write-Host "============================" -ForegroundColor Cyan
    Write-Host "   Spectrasonics 移行状況   " -ForegroundColor Cyan
    Write-Host "============================" -ForegroundColor Cyan
    
    if (Test-Path $dstPath) {
        try {
            $currentSize = (Get-ChildItem $dstPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $currentGB = [math]::round($currentSize / 1GB, 2)
            $percent = [math]::round(($currentGB / $srcSizeGB) * 100, 1)
            
            # Progress Bar
            $bars = [math]::floor($percent / 2)
            $progStr = "[" + ("#" * $bars) + ("-" * (50 - $bars)) + "]"
            
            Write-Host "転送済み: $currentGB GB / $srcSizeGB GB" -ForegroundColor White
            Write-Host "進捗率:   $percent %" -ForegroundColor Yellow
            Write-Host $progStr -ForegroundColor Green
        }
        catch {
            Write-Host "サイズ計算中..." -ForegroundColor Gray
        }
    }
    else {
        Write-Host "まだコピーが開始されていません..." -ForegroundColor Red
    }
    
    Write-Host "`n(Ctrl+C で終了)" -ForegroundColor Gray
    Start-Sleep -Seconds 10
}
