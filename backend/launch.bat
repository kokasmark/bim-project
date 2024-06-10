@echo off

:: Start ngrok with the specified domain
start "" cmd /k "ngrok http --domain=termite-deciding-ibex.ngrok-free.app 3001"

:: Start the Node.js server
cd C:\Users\met4y\Desktop\bim-project\backend\
node server.js



