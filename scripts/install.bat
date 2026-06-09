@echo off
setlocal

set "NODE_HOME=D:\Node.js"
set "PATH=%NODE_HOME%;%PATH%"
cd /d "%~dp0.."

if not exist "%NODE_HOME%\node.exe" (
  echo Node.js was not found at %NODE_HOME%.
  echo Please update NODE_HOME in this file if your Node.js path is different.
  exit /b 1
)

if not exist "%NODE_HOME%\npm.cmd" (
  echo npm.cmd was not found at %NODE_HOME%.
  exit /b 1
)

echo Using Node:
"%NODE_HOME%\node.exe" --version
echo.

echo Installing dependencies from npmmirror...
"%NODE_HOME%\npm.cmd" install --no-audit --no-fund --registry=https://registry.npmmirror.com
if %errorlevel% neq 0 (
  echo.
  echo npmmirror failed. Trying official npm registry...
  "%NODE_HOME%\npm.cmd" install --no-audit --no-fund
)

endlocal
