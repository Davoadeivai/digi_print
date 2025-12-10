param(
  [string]$Message = "chore(frontend): update LabelPage and add hooks",
  [switch]$Push
)

# Validate git repository
if (-not (Test-Path ".git")) {
  Write-Error "This folder is not a git repository. cd to the project root containing .git"
  exit 1
}

# Show status
git status --porcelain
Write-Host "`nStaging all changes..."
git add -A

# Commit
Write-Host "Committing with message: $Message"
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
  Write-Error "git commit failed. If there are no changes to commit, this will exit with code."
  exit $LASTEXITCODE
}

if ($Push) {
  Write-Host "Pushing to origin..."
  git push origin HEAD
  if ($LASTEXITCODE -ne 0) {
    Write-Error "git push failed."
    exit $LASTEXITCODE
  }
}

Write-Host "Done."