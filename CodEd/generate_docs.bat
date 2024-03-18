@echo off

rem Run JSDoc with the specified files
node_modules\.bin\jsdoc.cmd model\user.js public\javascripts\editor.mjs public\javascripts\editorModule.js public\javascripts\homepage.js public\javascripts\rollup.config.mjs
