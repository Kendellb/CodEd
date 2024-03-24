var express = require('express');
var router = express.Router();
var User = require('./users');
var fs = require('fs');
const { exec } = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('codeEditor', { title: 'Express' });
});

router.post('/runcode', (req, res) => {
  const javaCode = req.body.code;
  

  const tempFilePath = './tmpJava/Main.java';
  fs.writeFile(tempFilePath, javaCode, (err) => {
      if (err) {
          console.error('Error saving Java code:', err);
          return res.status(500).send('Error saving Java code');
      }

      console.log(`Java code saved to ${tempFilePath}`);

      exec('javac ./tmpJava/Main.java', (error, stdout, stderr) => {
          if (error) {
              console.error(`Compilation error: ${error.message}`);
              //return res.status(500).send('Compilation error');
              const errorMessage = stderr.replace(new RegExp(tempFilePath, 'g'), 'Main.java');
              return res.send(errorMessage).status(500);
          }

          console.log(`Compilation success: ${stdout}`);

          exec('java -classpath ./tmpJava Main', (error, stdout, stderr) => {
              if (error) {
                  console.error(`Execution error: ${error.message}`);
                  return res.status(500).send('Execution error');
              }

              console.log(`Output: ${stdout}`);
              res.send(stdout);
          });
      });
  });
});

module.exports = router;