'use strict';

const {By,Builder} = require('selenium-webdriver');
//For Presentation:
const stepTime = 2000;
//const stepTime = 0;
// Function to pause execution for a specified duration
async function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}



async function reg_selTest() {
    const driver = await new Builder().forBrowser('firefox').build();

    await driver.get('localhost:3000');

    // Set implicit wait timeout to 500 milliseconds
    await driver.manage().setTimeouts({ implicit: 5000 });

    await pause(stepTime); 
    const loginButton = await driver.findElement(By.id('Register'));
    await loginButton.click();
    await pause(stepTime); 

    const userNameInput = await driver.findElement(By.id('username'));
    await userNameInput.sendKeys('test_user123');
    const submitButton = await driver.findElement(By.id('submit'));
    await pause(stepTime); 
    await submitButton.click();
    await pause(stepTime);

    await driver.quit();
}


async function regWrongInput_selTest() {
    const driver = await new Builder().forBrowser('firefox').build();

    await driver.get('localhost:3000');

    // Set implicit wait timeout to 500 milliseconds
    await driver.manage().setTimeouts({ implicit: 5000 });

    await pause(stepTime); 
    const loginButton = await driver.findElement(By.id('Register'));
    await loginButton.click();
    await pause(stepTime); 

    const userNameInput = await driver.findElement(By.id('username'));
    await userNameInput.sendKeys('kendell');
    const submitButton = await driver.findElement(By.id('submit'));
    await pause(stepTime); 
    await submitButton.click();
    await pause(stepTime);

    await driver.quit();
}


async function save_selTest() {
    const driver = await new Builder().forBrowser('firefox').build();

    await driver.get('localhost:3000');

    // Set implicit wait timeout to 500 milliseconds
    await driver.manage().setTimeouts({ implicit: 5000 });

    await pause(stepTime); 
    const loginButton = await driver.findElement(By.id('Login'));
    await loginButton.click();
    await pause(stepTime); 

    const userNameInput = await driver.findElement(By.id('username'));
    await userNameInput.sendKeys('kendell');
    await pause(stepTime); 

    const submitLoginButton = await driver.findElement(By.id('UserLoginButton'));
    await submitLoginButton.click();
    //await pause(stepTime); 

    let editorText = await driver.findElement(By.className('cm-content'));
    await driver.executeScript("arguments[0].textContent = '';", editorText);
    await pause(stepTime); 

    await editorText.sendKeys('System.out.println("Hello World I am from the Sel Test");');
    await pause(stepTime); 

    const submitCodeButton = await driver.findElement(By.id('saveButton'));
    await submitCodeButton.click();
    await pause(stepTime); 

    await driver.quit();
}

test('Selenium editor test', save_selTest, 1000000);
test('Selenium Reg. test', reg_selTest, 1000000);
test('Selenium Reg. Wrong input test', regWrongInput_selTest, 1000000);
test('Selenium editor test', loginWrongInput_selTest, 1000000);
test('Selenium editor test', login_selTest, 1000000);

/*
save button test
registration test showing that a new user has a main class with nothing in it 
registration with the wrong input, user already exists
login with a user that is not in the database
login showing that code from the database is in the created editor. (Show this)
 */