param(
    [string]$mensaje = "Update"
)

git add .
git commit -m $mensaje
git push