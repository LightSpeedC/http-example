@pushd %~dp0
@set PORT=3000
@node client1 %PORT%
@popd
@node -e "process.stdout.write('\x1b[33;1mPress enter to exit (Enter�ŏI��) > \x1b[m')"
@pause > NUL
