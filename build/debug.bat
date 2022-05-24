@echo off
setlocal

pushd %~dp0\..

set CODE="node_modules\electron\dist\electron.exe"

node "build\preLaunch.js"
%CODE% . %*
