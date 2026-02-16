#!/usr/bin/env pwsh

# Script de commit para Scriptorium Arcontico
# Uso: .\tools\commit.ps1 "mensaje del commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$message,
    
    [switch]$push
)

Write-Host "=== SCRIPTORIUM ARCONTICO - Commit Script ===" -ForegroundColor Green
Write-Host ""

# Verificar que haya cambios
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "No hay cambios para commitear." -ForegroundColor Yellow
    exit 0
}

# Mostrar cambios que se van a commitear
Write-Host "Cambios a commitear:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Confirmar commit
Write-Host "Mensaje: $message" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "¿Confirmar commit? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Commit cancelado." -ForegroundColor Yellow
    exit 0
}

# Ejecutar commit
try {
    git add .
    git commit -m "$message"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Commit realizado exitosamente!" -ForegroundColor Green
        
        # Mostrar resumen
        $last_commit = git log -1 --pretty=format:"%h - %an, %ar : %s"
        Write-Host "Ultimo commit: $last_commit" -ForegroundColor Gray
        
        if ($push) {
            Write-Host ""
            Write-Host "Empujando cambios..." -ForegroundColor Cyan
            git push
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Cambios empujados exitosamente!" -ForegroundColor Green
            } else {
                Write-Host "❌ Error al empujar cambios" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ Error en el commit" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}