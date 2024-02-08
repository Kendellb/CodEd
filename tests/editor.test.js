'use strict';


const request = require('supertest');
const app = require('../CodEd/app');
const puppeteer = require('puppeteer');

async function waitForEditorToLoad() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the page
    await page.goto('http://localhost:3000'); // Replace with the actual URL and port number

    // Wait for the editor to load (assuming it's loaded after some time)
    await page.waitForSelector('.cm-line');

    // Close the browser
    await browser.close();
}

async function editorTest() {
     await waitForEditorToLoad();
    const response = await request(app).get('/').set('Accept', 'text/html');
    expect(response.type).toEqual("text/html");
    expect(response.status).toEqual(200);
    expect(response.text).toMatch(/<title>CodeMirror6<\/title>/);
    expect(response.text).toContain('<div class="cm-line">Hello World</div>');
}

test('Testing to make sure that the editor has appeared',
editorTest);