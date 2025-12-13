param(
    [string]$zip,
    [string]$dest
)

Write-Host "Importando paquete CapCut..."
Write-Host "ZIP: $zip"
Write-Host "Destino: $dest"

# Crear directorio destino si no existe
if (-not (Test-Path -LiteralPath $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

# Verificar existencia del ZIP
if (-not (Test-Path -LiteralPath $zip)) {
    Write-Host "ERROR: El archivo ZIP no existe."
    exit 1
}

# Descomprimir
Expand-Archive -LiteralPath $zip -DestinationPath $dest -Force

# Resolver ruta final
$finalPath = Resolve-Path -LiteralPath $dest

Write-Host "Ubicacion final: $finalPath"
Write-Host "Paquete importado correctamente."
