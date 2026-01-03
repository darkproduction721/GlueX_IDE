# PowerShell script to setup GlueX Build Environment

Write-Host "Checking for prerequisites..."

# 1. Install Visual Studio Build Tools (C++)
Write-Host "Installing Visual Studio Build Tools 2022..."
winget install --id Microsoft.VisualStudio.2022.BuildTools --silent --override "--wait --quiet --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
if ($testConnection) {
    Write-Host "VS Build Tools installation required reboot likely, or check logs."
}

# 2. Check Node Version
$nodeVersion = node -v
Write-Host "Current Node Version: $nodeVersion"
Write-Host "Recommended: v20.x or v22.x (Repo uses v22.11.0)"

# 3. Install NPM dependencies again (native modules)
Write-Host "Re-installing dependencies with native modules..."
npm install

Write-Host "Setup Complete. Try running 'npm run watch' or '.\scripts\code.bat'"
