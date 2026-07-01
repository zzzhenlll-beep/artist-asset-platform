@echo off
chcp 65001 >nul
setlocal

if "%~1"=="" (
  echo Usage: publish-github.cmd ^<GitHubUsername^> [RepoName]
  echo Example: publish-github.cmd zzzhenlll-beep artist-asset-platform
  exit /b 1
)

set "GITHUB_USER=%~1"
set "REPO_NAME=%~2"
if "%REPO_NAME%"=="" set "REPO_NAME=artist-asset-platform"

cd /d "%~dp0.."
set "REMOTE=https://github.com/%GITHUB_USER%/%REPO_NAME%.git"

echo Target: %REMOTE%

git remote get-url origin >nul 2>&1
if %errorlevel%==0 (
  git remote set-url origin "%REMOTE%"
  echo Updated remote origin
) else (
  git remote add origin "%REMOTE%"
  echo Added remote origin
)

git branch -M main
echo.
echo Pushing to GitHub... A login window may appear.
git push -u origin main

if %errorlevel%==0 (
  echo.
  echo Public URL: https://github.com/%GITHUB_USER%/%REPO_NAME%
) else (
  echo.
  echo Push failed. Ensure the repo exists on GitHub and you are logged in.
  exit /b 1
)
