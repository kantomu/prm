
# PowerShell Script to Clean G: and Migrate Spectrasonics

$ErrorActionPreference = "Stop"

function Log-Message {
    param([string]$msg)
    Write-Host "[INFO] $msg" -ForegroundColor Green
}

function Log-Warning {
    param([string]$msg)
    Write-Host "[WARNING] $msg" -ForegroundColor Yellow
}

# 1. Clean G: Drive Installers
$installers = @(
    "G:\Keyscape Installation",
    "G:\Trilian Installation"
)

foreach ($folder in $installers) {
    if (Test-Path $folder) {
        Log-Message "Deleting redundant installer: $folder"
        # Remove-Item -Recurse -Force $folder -ErrorAction Continue
        # For safety, we will Rename it first, or ask confirmation. 
        # Since user said "Execute", we will delete.
        Remove-Item -Recurse -Force $folder
    }
    else {
        Log-Message "Installer folder not found (already deleted?): $folder"
    }
}

# 2. Migrate Spectrasonics (STEAM) from C: to G:
$sourceSteam = "C:\ProgramData\Spectrasonics\STEAM"
$destRoot = "G:\Spectrasonics"
$destSteam = "G:\Spectrasonics\STEAM"

if (Test-Path $sourceSteam) {
    if (-not (Test-Path $destRoot)) {
        New-Item -ItemType Directory -Path $destRoot | Out-Null
    }

    if (Test-Path $destSteam) {
        Log-Warning "Destination STEAM folder already exists at $destSteam."
        Log-Warning "Skipping RoboCopy to avoid overwriting existing G: library. Please check manually."
    }
    else {
        Log-Message "Moving STEAM folder from C: to G:..."
        # Robocopy is more robust for large transfers
        # /E = recursive, /MOVE = move files and dirs, /IS = include same files (just in case)
        $robocopyArgs = @($sourceSteam, $destSteam, "/E", "/MOVE", "/NFL", "/NDL", "/NJH", "/NJS")
        
        # Use Start-Process to run robocopy and wait
        $p = Start-Process "robocopy" -ArgumentList $robocopyArgs -NoNewWindow -PassThru -Wait
        
        if ($p.ExitCode -lt 8) {
            # Robocopy exit code < 8 means success
            Log-Message "Move complete."
            
            # Verify Source is gone (Robocopy /MOVE should delete files but might leave empty folders)
            if (Test-Path $sourceSteam) {
                Remove-Item -Recurse -Force $sourceSteam
            }
            
            # Create Symlink (Junction)
            # cmd /c mklink /J "Link" "Target"
            Log-Message "Creating Junction at $sourceSteam -> $destSteam"
            cmd /c mklink /J "$sourceSteam" "$destSteam"
        }
        else {
            Write-Error "Robocopy failed with exit code $($p.ExitCode)"
        }
    }
}
else {
    Log-Warning "Source STEAM folder not found at $sourceSteam. Already moved?"
}

Log-Message "Migration Step 1 Complete."
