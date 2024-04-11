@echo off
setlocal

REM Path to JSDoc executable
set JSDOC_PATH=node_modules\.bin\jsdoc

REM Input files
set INPUT_FILES=model/user.js public/javascripts/editor.mjs model/editorModule.js model/editorModule.js public/javascripts/homepage.js public/javascripts/rollup.config.mjs 


REM Run JSDoc command
%JSDOC_PATH% %INPUT_FILES% 

echo Documentation generated
