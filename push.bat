@echo off
cd /d "%~dp0"

echo.
echo ===== Git Auto Push =====

git config --global http.version HTTP/1.1
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897

git add .

git diff --cached --quiet
if %errorlevel%==0 (
  echo.
  echo No new changes to commit.
) else (
  git commit -m "update"
)

echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
  echo.
  echo Push failed. Please check SakuraCat is running on port 7897.
  pause
  exit /b 1
)

echo.
echo Success. GitHub updated.
echo Vercel and GitHub Pages will redeploy automatically.
pause