@echo off
echo Starting Backend Server...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Starting server...
call npm start

pause
