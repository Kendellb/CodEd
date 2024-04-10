const { exec } = require('child_process');

test('Java program output test', (done) => {
  exec('javac ./javaTestFiles/HelloWorld.java', (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      console.error(`Error compiling Java program: ${compileError}`);
      throw new Error('Error compiling Java program');
    }

     exec('java -classpath ./javaTestFiles HelloWorld', (execError, execStdout, execStderr) => {
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
    exec('javac ./javaTestFiles/Input.java', (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error(`Error compiling Java program: ${compileError}`);
        throw new Error('Error compiling Java program');
      }
  
      const javap = exec('java -classpath ./javaTestFiles Input', (execError, execStdout, execStderr) => {
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

  /*
  test('Java program reading from a file test', (done) => {
    exec('javac ./javaTestFiles/File.java', (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error(`Error compiling Java program: ${compileError}`);
        throw new Error('Error compiling Java program');
      }
  
       exec('java -classpath ./javaTestFiles File', (execError, execStdout, execStderr) => {
        if (execError) {
          console.error(`Error executing Java program: ${execError}`);
          throw new Error('Error executing Java program');
        }
  
        //console.log(execStdout);
        expect(execStdout).toEqual('Hello, From text.txt');
        
        done();
      });
    });
  });
  */
