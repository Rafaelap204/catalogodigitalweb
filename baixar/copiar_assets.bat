@echo off
REM Script para copiar assets do PHP para Next.js

echo Copiando assets CSS/JS...

REM Criar estrutura de pastas
mkdir "..\ilink-next\public\_core\_cdn\panel\css" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\panel\js" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\bootstrap\css" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\bootstrap\js" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\jquery\js" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\lineicons\css" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\lineicons\fonts" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\fonts\fonts" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\fonts\logo" 2>nul
mkdir "..\ilink-next\public\_core\_cdn\img" 2>nul

REM Copiar CSS do painel
copy "public_html\_core\_cdn\panel\css\*.css" "..\ilink-next\public\_core\_cdn\panel\css\" /Y

REM Copiar JS do painel
copy "public_html\_core\_cdn\panel\js\*.js" "..\ilink-next\public\_core\_cdn\panel\js\" /Y

REM Copiar Bootstrap
copy "public_html\_core\_cdn\bootstrap\css\bootstrap.min.css" "..\ilink-next\public\_core\_cdn\bootstrap\css\" /Y
copy "public_html\_core\_cdn\bootstrap\js\bootstrap.min.js" "..\ilink-next\public\_core\_cdn\bootstrap\js\" /Y

REM Copiar jQuery
copy "public_html\_core\_cdn\jquery\js\jquery.min.js" "..\ilink-next\public\_core\_cdn\jquery\js\" /Y

REM Copiar LineIcons
copy "public_html\_core\_cdn\lineicons\css\*.css" "..\ilink-next\public\_core\_cdn\lineicons\css\" /Y
copy "public_html\_core\_cdn\lineicons\fonts\*" "..\ilink-next\public\_core\_cdn\lineicons\fonts\" /Y

REM Copiar Fonts
copy "public_html\_core\_cdn\fonts\*.css" "..\ilink-next\public\_core\_cdn\fonts\" /Y
copy "public_html\_core\_cdn\fonts\fonts\*" "..\ilink-next\public\_core\_cdn\fonts\fonts\" /Y
copy "public_html\_core\_cdn\fonts\logo\*" "..\ilink-next\public\_core\_cdn\fonts\logo\" /Y

REM Copiar Imagens
copy "public_html\_core\_cdn\img\*" "..\ilink-next\public\_core\_cdn\img\" /Y

echo Assets copiados com sucesso!
pause
