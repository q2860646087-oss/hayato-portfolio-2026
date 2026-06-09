@echo off
setlocal

set "NODE_HOME=D:\Node.js"
set "PATH=%NODE_HOME%;%PATH%"
cd /d "%~dp0.."

if not exist "%NODE_HOME%\node.exe" (
  echo Node.js was not found at %NODE_HOME%.
  exit /b 1
)

if not exist node_modules (
  echo node_modules was not found. Installing dependencies first...
  call "%~dp0install.bat"
  if %errorlevel% neq 0 exit /b %errorlevel%
)

"%NODE_HOME%\npm.cmd" run dev

endlocal
