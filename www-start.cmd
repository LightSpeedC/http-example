@pushd %~dp0
@set PORT=3000
@start /b node server %PORT%
@rem timeout /t 1 /nobreak > NUL
@node -e "setTimeout(process.exit, 1000)"
@node client %PORT%
@popd
@node -e "process.stdout.write('\x1b[33;1mPress enter to exit (Enter‚ÅI—¹) > \x1b[m')"
@pause > NUL
