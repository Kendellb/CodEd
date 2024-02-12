'use strict';


const request = require('supertest');
const app = require('../CodEd/app');



async function editorTest() {
    const response = await request(app).get('/').set('Accept', 'text/html');
    expect(response.type).toEqual("text/html");
    expect(response.status).toEqual(200);
    expect(response.text).toMatch(/<title>CodeMirror6<\/title>/);
}

test('Testing to make sure that the editor has appeared',
editorTest);