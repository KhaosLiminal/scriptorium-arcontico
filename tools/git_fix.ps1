#!/usr/bin/env pwsh

# Script para resolver problemas de submódulos y commits
# Uso: .\tools\git_fix.ps1

Write-Host "=== GIT FIX SCRIPT ===" -ForegroundColor Green
Write-Host ""

# Opción 1: Resetear el submódulo problemático
Write-Host "1. Restaurando submódulo kraken_liminal_lab_MD..." -ForegroundColor Cyan
Set-Location kraken_liminal_lab_MD
git checkout .
git clean -fd
Set-Location ..

# Opción 2: Actualizar submódulos
Write-Host "2. Actualizando submódulos..." -ForegroundColor Cyan
git submodule update --init --recursive

# Opción 3: Mostrar estado actual
Write-Host "3. Estado actual del repositorio:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "✅ Proceso completado. Ahora puedes hacer commits normalmente." -ForegroundColor Green