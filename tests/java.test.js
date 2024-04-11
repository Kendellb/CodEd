const { exec } = require('child_process');

test('Java program output test', (done) => {
  exec('javac ./tests/javaTestFiles/HelloWorld.java', (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      console.error(`Error compiling Java program: ${compileError}`);
      throw new Error('Error compiling Java program');
    }

     exec('java -classpath ./tests/javaTestFiles HelloWorld', (execError, execStdout, execStderr) => {
      if (execError) {
        console.error(`Error executing Java program: ${execError}`);
        throw new Error('Error executing Java program');
      }

      expect(execStdout.trim()).toEqual('Hello, World!');

      done();
    });
  });
});

test('Java program input test', (done) => {
    exec('javac ./tests/javaTestFiles/Input.java', (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error(`Error compiling Java program: ${compileError}`);
        throw new Error('Error compiling Java program');
      }
  
      const javap = exec('java -classpath ./tests/javaTestFiles Input', (execError, execStdout, execStderr) => {
        if (execError) {
          console.error(`Error executing Java program: ${execError}`);
          throw new Error('Error executing Java program');
        }
  
        //console.log(execStdout);
        expect(execStdout.trim()).toEqual('Hello Kendell');
        
        done();
      });
      javap.stdin.write('Kendell\n');
        javap.stdin.end();
    });
  });
