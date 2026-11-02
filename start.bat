@echo off
title "PROGRAM CEK DATAHARIAN - AUTO JALAN"
color a

echo [1/2] Menjalankan BACKEND...
start "BACKEND - Cek Data Harian" /D "D:\PROJECT\REACT\my-jobs\backend" cmd /k node server.js

echo [2/2] Menjalankan FRONTEND...
start "FRONTEND - Cek Data Harian" /D "D:\PROJECT\REACT\my-jobs" cmd /k npm start

echo Semua program sudah jalan!
timeout /t 3
exit