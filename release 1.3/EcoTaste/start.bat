@echo off

:: Запуск сервера в новом окне
start cmd /k "cd /d %USERPROFILE%\Desktop\EcoTaste\server && node server.js"

:: Запуск фронтенда в новом окне
start cmd /k "cd /d %USERPROFILE%\Desktop\EcoTaste && npm run dev"

start http://localhost:5173