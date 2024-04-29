const supertest = require('supertest');
const app = require('../CodEd/app');


describe('GET /', function () {
  it('responds with status 200 and renders the codeEditor page if user is logged in', function (done) {
    const agent = supertest.agent(app); // Create a supertest agent to persist session cookies
    agent
      .get('/users/login') // Assume the user logs in first, change the route accordingly if necessary
      .send({ username: 'your_username', password: 'your_password' }) // Adjust credentials as per your implementation
    agent
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
/*
describe('POST /editor/runcode', function () {
  it('responds with status 200 and success message if Java code is saved successfully', function (done) {
    const javaCode = 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }';
    supertest(app)
      .post('/editor/runcode')
      .send({ code: javaCode })
      .expect(200)
      .expect('Java code saved successfully', done);
  });

  // Add more test cases for error scenarios if necessary
});

describe('POST /runcodeUpload', function () {
  it('responds with status 200 and success message if Java code is saved successfully', function (done) {
    const javaCode = 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }';
    const userID = 'testUserID'; // Assuming a test user ID
    supertest(app)
      .post(`/editor/runcodeUpload?userID=${userID}`)
      .send({ code: javaCode })
      .expect(200)
      .expect('Java code saved successfully', done);
  });

  // Add more test cases for error scenarios if necessary
});
*/
/*
describe('GET /get-userID', function () {
  it('responds with status 200 and returns the session userID', function (done) {
    const userID = 'kendell-163bc2e1'; // Assuming a test user ID
    const agent = supertest.agent(app); // Create a supertest agent to persist session cookies

    agent
      .get('/editor/get-userID')
      .expect(200)
  });
});

describe('GET /get-uploadID', function () {
  it('responds with status 200 and returns combined userID', function (done) {
    const sessionUserID = 'kendell-163bc2e1';
    const queryUserID = 'kendell-163bc2e1';
    supertest(app)
      .get(`/editor/get-uploadID?userID=${queryUserID}`)
      .set('Cookie', `userID=${sessionUserID}`) // Assuming userID is stored in cookies
      .expect(200)
  });
});
*/

describe('GET /index', function () {
  it('responds with status 200 and returns the index value', function (done) {
    const indexValue = 'testIndexValue';
    supertest(app)
      .get(`/editor/index?index=${indexValue}`)
      .expect(200)
      .expect(indexValue, done);
  });
});

describe('POST /upload', function () {
  // Add test cases for upload functionality
});

describe('GET /studentSubmissonEditor', function () {
  it('responds with status 200 and renders the studentSubmissonEditor page if user is logged in as instructor', function (done) {
    const sessionUser = { username: 'testUsername', accountType: 'instructor' }; // Assuming a test user object
    const userID = 'testUserID'; // Assuming a test user ID
    const agent = supertest.agent(app); // Create a supertest agent to persist session cookies

    agent
      .get(`/editor/studentSubmissonEditor?userID=${userID}`)
      .set('Cookie', `sessionUser=${JSON.stringify(sessionUser)}`) // Assuming session user is stored in cookies
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

it('responds with status 200 and returns "Have to be an instructor" if user is not logged in as instructor', function (done) {
  const sessionUser = { username: 'testUsername', accountType: 'student' }; // Assuming a test user object
  const agent = supertest.agent(app); // Create a supertest agent to persist session cookies

  agent
    .get('/editor/studentSubmissonEditor')
    .set('Cookie', `sessionUser=${JSON.stringify(sessionUser)}`) // Assuming session user is stored in cookies
    .expect(200)
    .expect('Have to be an instructor', done);
});