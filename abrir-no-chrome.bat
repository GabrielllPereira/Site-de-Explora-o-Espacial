@echo off
setlocal

REM Abre o site local sempre no Google Chrome.
REM Se não funcionar, verifique se o Chrome está instalado e no PATH.

set "SITE=%~dp0index.html"

start "" chrome "%SITE%"
