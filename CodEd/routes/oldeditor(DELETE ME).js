router.post('/runcode', (req, res) => {
    const javaCode = req.body.code;
    const userID = req.session.user.uniqueID;
    console.log('userId', userID);

    const tempFilePath = `./tmpJava/${userID}/Main.java`;
    const tempFileDir = `./tmpJava/${userID}`;
    if (!fs.existsSync(tempFileDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(tempFileDir, { recursive: true });
        console.log(`Directory '${tempFileDir}' created successfully.`);
    } else {
        console.log(`Directory '${tempFileDir}' already exists.`);
    }

    fs.writeFile(tempFilePath, javaCode, (err) => {
        //NEED TO SANITIZE DATA LATER FOR SECURITY
        if (err) {
            console.error('Error saving Java code:', err);
            return res.status(500).send('Error saving Java code');
        }

        console.log(`Java code saved to ${tempFilePath}`);

        });

        exec(`javac ${tempFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Compilation error: ${error.message}`);
                //return res.status(500).send('Compilation error');
                const errorMessage = stderr.replace(new RegExp(tempFilePath, 'g'), 'Main.java');
                return res.send(errorMessage).status(500);
            }

            else{

            console.log(`Compilation success: `);


            // Execute the Java program
            const javaProcess = exec(`java -classpath ./tmpJava/${userID} Main`, (error, stdout, stderr) => {

                console.log(`Running ${tempFilePath}`);

                if (error) {
                    // Handle errors from the Java program
                    javaProcess.stderr.on('data', (data) => {
                        console.error(`Java program error: ${data}`);
                        res.status(500).send(`Java program error: ${data}`);
                    });
                }
                else {

                    // Provide input to the Java program
                    const inputData = "Input data\nAnother line\n"; // Example input data
                    javaProcess.stdin.write(inputData);
                    javaProcess.stdin.end(); // Close the input stream after writing all data

                    // Handle output from the Java program
                    javaProcess.stdout.on('data', (data) => {
                        console.log(`Output: ${data}`);
                        res.send(data);
                    });
                }
            });
        }
        });
           
        
    });
