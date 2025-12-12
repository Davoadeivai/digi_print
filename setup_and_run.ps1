<#
Setup and run script for local development (PowerShell)

What it does:
- Installs backend requirements into .venv
- Runs Django makemigrations and migrate
- Creates a non-interactive superuser if not exists (admin@example.com / AdminPass123)
- Starts Django development server in background on 0.0.0.0:8000
- Waits for server to become available and runs smoke tests
- Stops the server after tests complete

# Usage:
#   Open PowerShell as user, then run:
#   powershell -ExecutionPolicy Bypass -File .\setup_and_run.ps1
#>

Set-StrictMode -Version Latest
ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Script root: $scriptRoot"

# Paths
$venvPython = Join-Path $scriptRoot '.venv\Scripts\python.exe'
$backendDir = Join-Path $scriptRoot 'backend'

if (-not (Test-Path -LiteralPath $venvPython)) {
    Write-Error "Virtualenv python not found at $venvPython. Activate your venv or ensure .venv exists."
    exit 1
}

function Run-Proc($file, $args) {
    Write-Host ">> $file $args"
    $p = Start-Process -FilePath $file -ArgumentList $args -NoNewWindow -Wait -PassThru
    return $p
}

Write-Host "Upgrading pip/setuptools/wheel and installing backend requirements..."
Run-Proc $venvPython @('-m','pip','install','--upgrade','pip','setuptools','wheel') | Out-Null
Run-Proc $venvPython @('-m','pip','install','--no-cache-dir','--only-binary=:all:', '-r', (Join-Path $backendDir 'requirements.txt')) | Out-Null

Write-Host "Running makemigrations and migrate..."
Set-Location -LiteralPath $backendDir
Run-Proc $venvPython @('manage.py','makemigrations','--noinput') | Out-Null
Run-Proc $venvPython @('manage.py','migrate','--noinput') | Out-Null

Write-Host "Ensuring superuser exists (admin@example.com)..."
$tmp = Join-Path $env:TEMP ('create_superuser_' + [guid]::NewGuid().ToString() + '.py')
$py = @'
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','config.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser(email='admin@example.com', password='AdminPass123')
    print('superuser: created')
else:
    print('superuser: already exists')
'@

Set-Content -LiteralPath $tmp -Value $py -Encoding UTF8
Run-Proc $venvPython @($tmp) | Out-Null
Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue

Write-Host "Starting Django development server in background..."
$serverProc = Start-Process -FilePath $venvPython -ArgumentList @('manage.py','runserver','0.0.0.0:8000') -PassThru
Write-Host "Server started with PID $($serverProc.Id)"

Write-Host "Waiting for server to accept connections on port 8000..."
$maxWait = 60
$i = 0
while ($i -lt $maxWait) {
    try {
        $res = Test-NetConnection -ComputerName '127.0.0.1' -Port 8000 -WarningAction SilentlyContinue
        if ($res.TcpTestSucceeded) { break }
    } catch {}
    Start-Sleep -Seconds 1
    $i++
}
if ($i -ge $maxWait) {
    Write-Error "Server did not start listening on port 8000 within $maxWait seconds. Check logs."
    exit 2
}

Write-Host "Running smoke tests..."
Run-Proc $venvPython @(Join-Path $backendDir 'scripts\smoke_tests.py') | Out-Null

Write-Host "Stopping server (PID $($serverProc.Id))..."
try { Stop-Process -Id $serverProc.Id -ErrorAction SilentlyContinue } catch {}

Write-Host "Done."
