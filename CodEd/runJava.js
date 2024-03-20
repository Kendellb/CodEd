const { exec } = require('child_process');
const fs = require('fs');

//Proof of concept 
const javaCode = `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`;

// Save the Java code to a temporary file (e.g., HelloWorld.java)
const tempFilePath = './tmpJava/HelloWorld.java';

fs.writeFile(tempFilePath, javaCode, (err) => {
    if (err) {
        console.error('Error saving Java code:', err);
    } else {
        console.log(`Java code saved to ${tempFilePath}`);
    }
});

// Compile the Java code
exec('javac ./tmpJava/HelloWorld.java', (error, stdout, stderr) => {
    if (error) {
        console.error(`Compilation error: ${error.message}`);
        return;
    }
    console.log(`Compilation success: ${stdout}`);

    // Execute the compiled Java program
    exec('java -classpath ./tmpJava HelloWorld', (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });

    
});