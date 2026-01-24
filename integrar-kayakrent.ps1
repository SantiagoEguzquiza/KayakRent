# Opción 2: Integrar kayakrent-maldonado en el repo KayakRent
# Ejecutar en PowerShell desde la raíz KayakRent.
# Cierra Cursor y pausa OneDrive para esta carpeta si da "Access denied".

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# 1. Quitar index.lock si existe
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
Remove-Item -Force kayakrent-maldonado\.git\index.lock -ErrorAction SilentlyContinue

# 2. Dejar de trackear kayakrent-maldonado como gitlink
git rm --cached kayakrent-maldonado

# 3. Eliminar el .git interno
Remove-Item -Recurse -Force kayakrent-maldonado\.git

# 4. Añadir kayakrent-maldonado como carpeta normal
git add kayakrent-maldonado

# 5. Añadir el resto (p. ej. README)
git add .

# 6. Commit y push
git commit -m "chore: track kayakrent-maldonado as normal folder"
git push origin main

Write-Host "Listo. A partir de ahora trabaja en la raíz KayakRent para git add/commit/push."
