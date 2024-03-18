'use strict';

//For Presentation:
const stepTime = 2000;
//const stepTime = 0;
const { By, Builder } = require('selenium-webdriver');

async function save_selTest() {
    const driver = await new Builder().forBrowser('firefox').build();

    await driver.get('localhost:3000');

    // Set implicit wait timeout to 500 milliseconds
    await driver.manage().setTimeouts({ implicit: 500 });

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

// Function to pause execution for a specified duration
async function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Assuming the 'test' function is defined elsewhere
test('Selenium editor test', save_selTest, 1000000);

