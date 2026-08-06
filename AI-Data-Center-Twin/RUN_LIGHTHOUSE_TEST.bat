@echo off
title AI Data Center - Production Lighthouse Test
echo.
echo IMPORTANT: Close every old localhost:5173 terminal with Ctrl+C first.
echo This command builds and serves the MINIFIED production application.
echo.
call npm install
if errorlevel 1 goto :error
call npm run dev
if errorlevel 1 goto :error
goto :eof

:error
echo.
echo The production server could not start. Check the error above.
pause
