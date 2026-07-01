param(
  [Parameter(Mandatory = $true)]
  [string]$GitHubUser,

  [string]$RepoName = "artist-asset-platform"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot + "\.."

$remoteUrl = "https://github.com/$GitHubUser/$RepoName.git"

Write-Host "Target: $remoteUrl"

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  git remote set-url origin $remoteUrl
  Write-Host "Updated remote origin"
} else {
  git remote add origin $remoteUrl
  Write-Host "Added remote origin"
}

git branch -M main
git push -u origin main

Write-Host ""
Write-Host "Public URL: https://github.com/$GitHubUser/$RepoName"
