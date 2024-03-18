#!/bin/bash

# Check if the platform is Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    JSDOC_COMMAND="jsdoc.cmd"
else
    JSDOC_COMMAND="jsdoc"
fi

# Run JSDoc with the specified files
"$JSDOC_COMMAND" model/user.js public/javascripts/editor.mjs public/javascripts/editorModule.js public/javascripts/homepage.js public/javascripts/rollup.config.mjs
