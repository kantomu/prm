
# PowerShell Script to Migrate Spectrasonics (Robust Mode)

$ErrorActionPreference = "Stop"

function Log-Message {
    param([string]$msg)
    Write-Host "[INFO] $msg" -ForegroundColor Green
}

function Log-Error {
    param([string]$msg)
    Write-Host "[ERROR] $msg" -ForegroundColor Red
}

$sourceSteam = "C:\ProgramData\Spectrasonics\STEAM"
$destRoot = "G:\Spectrasonics"
$destSteam = "G:\Spectrasonics\STEAM"

# 1. Verification
if (-not (Test-Path $sourceSteam)) {
    Log-Error "Source STEAM folder not found at $sourceSteam"
    exit
}

if (-not (Test-Path $destRoot)) {
    New-Item -ItemType Directory -Path $destRoot | Out-Null
}

# 2. Copy (Not Move) to G:
Log-Message "Copying STEAM folder to G: (This may take time)..."
# /E = recursive, /COPYALL = copy info, /B = backup mode, /R:3 /W:3 = retry
$robocopyArgs = @($sourceSteam, $destSteam, "/E", "/COPY:DAT", "/R:1", "/W:1", "/NFL", "/NDL", "/NJH", "/NJS")
$p = Start-Process "robocopy" -ArgumentList $robocopyArgs -NoNewWindow -PassThru -Wait

if ($p.ExitCode -ge 8) {
    Log-Error "Robocopy failed with exit code $($p.ExitCode)"
    exit
}

Log-Message "Copy complete. verifying size..."
$srcSize = (Get-ChildItem $sourceSteam -Recurse | Measure-Object -Property Length -Sum).Sum
$dstSize = (Get-ChildItem $destSteam -Recurse | Measure-Object -Property Length -Sum).Sum

Log-Message "Source Size: $([math]::round($srcSize/1GB, 2)) GB"
Log-Message "Dest Size:   $([math]::round($dstSize/1GB, 2)) GB"

if ($dstSize -lt $srcSize) {
    Log-Error "Destination size is smaller! Copy might be incomplete. Aborting."
    exit
}

# 3. Rename Source (Safe Deletion)
Log-Message "Renaming source folder to STEAM_BACKUP..."
try {
    Rename-Item -Path $sourceSteam -NewName "STEAM_BACKUP"
}
catch {
    Log-Error "Failed to rename source folder. Access might be denied."
    Log-Error "Please manually delete or rename '$sourceSteam' and then run the linking step."
    exit
}

# 4. Create Link
Log-Message "Creating Junction..."
cmd /c mklink /J "$sourceSteam" "$destSteam"

Log-Message "Migration Complete! You can delete 'C:\ProgramData\Spectrasonics\STEAM_BACKUP' after confirming everything works."
