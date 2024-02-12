'use strict';

const {By, Builder, Browser} = require('selenium-webdriver');

async function editor_selTest(){

const driver = await new Builder().forBrowser('firefox').build();

await driver.get('localhost:3000');

//let title = await driver.getTitle();

await driver.manage().setTimeouts({implicit: 500});

let editor = await driver.findElement(By.className('cm-editor'));

let editorText = await driver.findElement(By.className('cm-content'));

await editorText.sendKeys('System.out.println("Hello World");')

let sysOut = await driver.findElement(By.className('ͼi'));

let helloWorld = await driver.findElement(By.className('ͼe'));


/*let submitButton = await driver.findElement(By.css('button'));

await textBox.sendKeys('Selenium');
await submitButton.click();

let message = await driver.findElement(By.id('message'));
let value = await message.getText();*/

await driver.sleep(1000); // to allow the user to see that the text had been inputed

await driver.quit();
}

test('Selenium editor test', editor_selTest);