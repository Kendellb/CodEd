const { exec } = require('child_process');
const path = require('path');
const os = require('os');

// Function to run JSDoc command based on OS
function runJSDocCommand() {
    const isWindows = os.platform() === 'win32';

    const scriptPath = isWindows ? 'generate_docs.bat' : './generate_docs.sh';

    const absoluteScriptPath = path.resolve(__dirname, scriptPath);

    exec(absoluteScriptPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(stdout);
        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
        }
    });
}

runJSDocCommand();

