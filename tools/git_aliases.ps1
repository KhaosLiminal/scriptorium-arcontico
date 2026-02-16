# Alias simples para Git - Guardar en tu $PROFILE
# Copiar estas líneas a tu perfil de PowerShell:

# Abrir perfil: notepad $PROFILE
# Pegar estas líneas y guardar:

# Alias básicos
function Git-Commit { param([string]$Message); git add .; git commit -m $Message }
function Git-Push { param([string]$Message); git add .; git commit -m $Message; git push }
function Git-Status { git status }
function Git-Log { git log --oneline -10 }

# Shortcuts
Set-Alias -Name gc -Value Git-Commit
Set-Alias -Name gcp -Value Git-Push
Set-Alias -Name gs -Value Git-Status
Set-Alias -Name gl -Value Git-Log

Write-Host "Aliases de Git cargados:" -ForegroundColor Green
Write-Host "gc 'mensaje'   - Git commit" -ForegroundColor White
Write-Host "gcp 'mensaje'  - Git commit + push" -ForegroundColor White
Write-Host "gs             - Git status" -ForegroundColor White
Write-Host "gl             - Git log" -ForegroundColor White