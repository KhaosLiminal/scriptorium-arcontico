# Setup de aliases para Git
# Ejecutar: . .\tools\setup_aliases.ps1

Write-Host "Configurando aliases de Git..." -ForegroundColor Green

# Crear funciones
function gc { 
    param([string]$m)
    git add .
    git commit -m $m
    Write-Host "✅ Commit realizado: $m" -ForegroundColor Green
}

function gcp { 
    param([string]$m)
    git add .
    git commit -m $m
    git push
    Write-Host "✅ Commit y push realizados: $m" -ForegroundColor Green
}

function gs {
    git status
}

function gl {
    git log --oneline -10
}

# Exportar funciones al scope global
Export-ModuleMember -Function gc, gcp, gs, gl

Write-Host "✅ Aliases configurados:" -ForegroundColor Green
Write-Host "  gc 'mensaje'   - Git commit" -ForegroundColor White
Write-Host "  gcp 'mensaje'  - Git commit + push" -ForegroundColor White
Write-Host "  gs             - Git status" -ForegroundColor White
Write-Host "  gl             - Git log (últimos 10)" -ForegroundColor White