@echo off
cd /d "%~dp0"

echo.
echo ===== Git Auto Push =====
git status
git add .

git diff --cached --quiet
if %errorlevel%==0 (
  echo.
  echo No changes to commit.
  echo Nothing to push.
  pause
  exit /b 0
)

set /p msg=Commit message:
if "%msg%"=="" set msg=update

git commit -m "%msg%"
git push origin main

echo.
echo Done. Vercel will redeploy automatically.
pause