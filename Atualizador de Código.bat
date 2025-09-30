@echo off
title Atualizador de Repositório Git

echo -------------------------------------------------
echo         ATUALIZADOR DE CODIGO - ECOEXPLORADOR
echo -------------------------------------------------
echo.

REM Passo 1: Sincroniza com o repositório online para obter as últimas alterações.
echo [PASSO 1 de 4] Sincronizando com o GitHub (git pull)...
git pull origin main
echo.

REM Passo 2: Adiciona todos os ficheiros novos ou modificados.
echo [PASSO 2 de 4] Adicionando todos os ficheiros (git add)...
git add .
echo.

REM Passo 3: Pede ao utilizador para inserir uma mensagem de commit.
echo [PASSO 3 de 4] Por favor, descreva as alterações que fez.
set /p commit_message="Mensagem do Commit: "
echo.

REM Passo 4: Faz o commit com a mensagem fornecida e envia para o GitHub.
echo [PASSO 4 de 4] Fazendo o commit e enviando para o GitHub (git push)...
git commit -m "%commit_message%"
git push origin main

echo.
echo -------------------------------------------------
echo         PROCESSO CONCLUIDO!
echo -------------------------------------------------
echo.
pause