#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Building DeskBridge Server for Windows..." -ForegroundColor Cyan
cargo build --release -p deskbridge-server
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$Exe = Join-Path $Root "target\release\deskbridge-server.exe"
$InstallDir = Join-Path $env:LOCALAPPDATA "DeskBridge"
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Copy-Item $Exe $InstallDir -Force

$ShortcutDir = [Environment]::GetFolderPath("Programs")
$ShortcutPath = Join-Path $ShortcutDir "DeskBridge Server.lnk"
$Wsh = New-Object -ComObject WScript.Shell
$Shortcut = $Wsh.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = Join-Path $InstallDir "deskbridge-server.exe"
$Shortcut.WorkingDirectory = $InstallDir
$Shortcut.Description = "DeskBridge Windows companion"
$Shortcut.Save()

# Firewall rule for private networks
$RuleName = "DeskBridge Server"
$Existing = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
if (-not $Existing) {
    Write-Host "Adding Windows Firewall rule for private networks..." -ForegroundColor Yellow
    New-NetFirewallRule -DisplayName $RuleName `
        -Direction Inbound `
        -Program (Join-Path $InstallDir "deskbridge-server.exe") `
        -Action Allow `
        -Profile Private `
        -Protocol TCP `
        -LocalPort 9478 | Out-Null
}

Write-Host ""
Write-Host "Installed to: $InstallDir" -ForegroundColor Green
Write-Host "Start Menu shortcut: DeskBridge Server"
Write-Host ""
Write-Host "Launch DeskBridge Server from the Start Menu, then connect from your Mac."
