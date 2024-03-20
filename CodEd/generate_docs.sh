#!/bin/bash

# Check if JSDoc command exists
if ! command -v jsdoc &> /dev/null
then
    echo "JSDoc not found. Please make sure JSDoc is installed and added to your PATH."
    exit 1
fi

# Run JSDoc with the specified files
jsdoc model/user.js public/javascripts/editor.mjs model/editorModule.js public/javascripts/homepage.js public/javascripts/rollup.config.mjs
