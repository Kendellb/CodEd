'use strict';

const request = require('supertest');
const app = require('../CodEd/app');
const mongoose = require('mongoose');

const uri = "mongodb+srv://test:test@coded.p7136aw.mongodb.net/?retryWrites=true&w=majority&appName=CodEd";
// MongoDB connection code
const mongoConnectionPromise = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err.message));

async function editorTest() {
    // Wait for the MongoDB connection to be established
    await mongoConnectionPromise;

    const response = await request(app).get('/editor').set('Accept', 'text/html');
    expect(response.type).toEqual("text/html");
    expect(response.status).toEqual(200);
    expect(response.text).toMatch(/<title>CodEd<\/title>/);
}

test('Testing to make sure that the editor has appeared', editorTest);
