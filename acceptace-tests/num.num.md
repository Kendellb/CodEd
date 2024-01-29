# 1.1 As a student, I want to submit homework. [ copy of your Project title ] 
## User Acceptance Test 1: Normal case

1. Browse to the page http://www.example.com/submit. System responds with form for submitting homework.
2. Click the Open button. System responds with a file explorer window.
3. Locate a .java file to submit, click on it, and click the OK button. File explorer window closes and file name appears on the submission form.
4. Click the Upload button. After perhaps a short delay, system responds with a page stating that file xxx was successfully uploaded.

## User Acceptance Test 2: Error case - User clicks buttons out of order

1. Browse to the page http://www.example.com/submit. System responds with form for submitting homework.
2. Click the Upload button. System will respond with a message on the form stating that no file has been selected.

## User Acceptance Test 3: Error case - User attempts to upload non-Java file

1. Browse to the page http://www.example.com/submit. System responds with form for submitting homework.
2. Click the Open button. System responds with a file explorer window.
3. Locate a file that does not have the extension .java, click on it, and click the OK button. File explorer window closes and file name appears on the submission form.
4. Click the Upload button. System displays an error message on the form stating that only .java files can be uploaded.
