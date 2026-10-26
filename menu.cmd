@echo off
setlocal
cd /d "%~dp0"
set "CIRILLO_COMPOSE=%~dp0compose.yaml"
set "REFERENCE_COMPOSE=%~dp0..\other\Real-Estate-Website-windows\compose.preview.yaml"

:menu
cls
echo ============================================================
echo                 CASE A ROMA - ANTEPRIME LOCALI
echo ============================================================
echo.
echo   Cirillo adattato:    http://localhost:5173
echo   Template originale:  http://localhost:5174
echo.
echo   1  Avvia / aggiorna Cirillo (design BuildEstate)
echo   2  Avvia / aggiorna il template e apri il browser
echo   3  Avvia / aggiorna entrambi e apri il confronto
echo   4  Ferma Cirillo
echo   5  Ferma il template originale
echo   6  Ferma entrambi
echo   7  Genera i file statici di Cirillo (nessun deploy)
echo   8  Mostra lo stato dei container
echo   9  Mostra i messaggi recenti dei due siti
echo   0  Esci dal menu (i siti accesi restano attivi)
echo.
choice /c 1234567890 /n /m "Premi un numero: "
set "MENU_CHOICE=%errorlevel%"
if "%MENU_CHOICE%"=="10" exit /b 0
if "%MENU_CHOICE%"=="0" exit /b 0
if "%MENU_CHOICE%"=="255" exit /b 1
call :check_docker
if errorlevel 1 goto :done
if "%MENU_CHOICE%"=="1" goto :start_cirillo
if "%MENU_CHOICE%"=="2" goto :start_reference
if "%MENU_CHOICE%"=="3" goto :start_both
if "%MENU_CHOICE%"=="4" goto :stop_cirillo
if "%MENU_CHOICE%"=="5" goto :stop_reference
if "%MENU_CHOICE%"=="6" goto :stop_both
if "%MENU_CHOICE%"=="7" goto :build_static
if "%MENU_CHOICE%"=="8" goto :status
if "%MENU_CHOICE%"=="9" goto :logs
goto :menu

:start_cirillo
call :up_cirillo
if errorlevel 1 goto :failed
start "" "http://localhost:5173"
goto :done

:start_reference
call :up_reference
if errorlevel 1 goto :failed
start "" "http://localhost:5174"
goto :done

:start_both
call :up_cirillo
if errorlevel 1 goto :failed
call :up_reference
if errorlevel 1 goto :failed
start "" "http://localhost:5173"
start "" "http://localhost:5174"
goto :done

:stop_cirillo
docker compose -f "%CIRILLO_COMPOSE%" down
if errorlevel 1 goto :failed
goto :done

:stop_reference
docker compose -f "%REFERENCE_COMPOSE%" down
if errorlevel 1 goto :failed
goto :done

:stop_both
docker compose -f "%CIRILLO_COMPOSE%" down
if errorlevel 1 goto :failed
docker compose -f "%REFERENCE_COMPOSE%" down
if errorlevel 1 goto :failed
goto :done

:build_static
docker compose -f "%CIRILLO_COMPOSE%" build web
if errorlevel 1 goto :failed
docker compose -f "%CIRILLO_COMPOSE%" run --rm --no-deps -v "%~dp0dist:/app/dist" web npm run build
if errorlevel 1 goto :failed
echo File pronti nella cartella dist. Nessuna pubblicazione eseguita.
goto :done

:status
echo.
echo CIRILLO
docker compose -f "%CIRILLO_COMPOSE%" ps -a
if errorlevel 1 goto :failed
echo.
echo TEMPLATE ORIGINALE
docker compose -f "%REFERENCE_COMPOSE%" ps -a
if errorlevel 1 goto :failed
goto :done

:logs
echo.
echo CIRILLO
docker compose -f "%CIRILLO_COMPOSE%" logs --tail 25
if errorlevel 1 goto :failed
echo.
echo TEMPLATE ORIGINALE
docker compose -f "%REFERENCE_COMPOSE%" logs --tail 25
if errorlevel 1 goto :failed
goto :done

:failed
echo.
echo Operazione non riuscita. Controlla il messaggio sopra.
echo Per maggiori dettagli scegli 9 nel menu.
echo Verifica che Docker sia pronto e le porte 5173 e 5174 siano libere.
:done
echo.
pause
goto :menu

:check_docker
where docker >nul 2>&1
if errorlevel 1 (
  echo Docker non trovato. Installa Docker Desktop.
  exit /b 1
)
docker info >nul 2>&1
if errorlevel 1 (
  echo Apri Docker Desktop in modalita Linux e attendi che sia pronto.
  exit /b 1
)
exit /b 0

:up_cirillo
echo Preparazione di Cirillo...
docker compose -f "%CIRILLO_COMPOSE%" up --build -d --wait --wait-timeout 120
exit /b %errorlevel%

:up_reference
if not exist "%REFERENCE_COMPOSE%" (
  echo Template non trovato nella cartella other accanto a cirillo_student_house.
  exit /b 1
)
echo Preparazione del template originale. Al primo avvio serve Internet.
docker compose -f "%REFERENCE_COMPOSE%" up --build -d --wait --wait-timeout 120
exit /b %errorlevel%
