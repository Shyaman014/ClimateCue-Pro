@echo off
title ClimateCue Pro - Launch Services
echo ==========================================
echo    Starting ClimateCue Pro Stack
echo ==========================================
echo.
echo [1/2] Starting Spring Boot Backend (Port 8081)...
start "ClimateCue Backend (Port 8081)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo [2/2] Starting React Vite Frontend (Port 5173)...
start "ClimateCue Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================
echo Services are starting in separate windows!
echo - Backend:  http://localhost:8081/api/health
echo - Frontend: http://localhost:5173/
echo ==========================================
