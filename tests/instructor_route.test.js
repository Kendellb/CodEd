const supertest = require('supertest');
const app = require('../CodEd/app');



describe('GET /', () => {
  it('responds with status 200 and renders instructor template for instructor user', async () => {
    const agent = supertest.agent(app); // Using supertest.agent

    // Assuming you have a valid session for an instructor user
    const sessionData = {
      user: {
        uniqueID: 'Jackson-6510da37', // Replace with a valid uniqueID of an instructor user
        accountType: 'instructor' // Set accountType to 'instructor'
      }
    };

    // Make the request with session data
    const response = await agent
      .get('/')
      .set('Cookie', ['your-session-cookie']) // Replace 'your-session-cookie' with your actual session cookie
      .send(sessionData);

    expect(response.status).toBe(200);
  });

  it('responds with status 302 and redirects to login page for non-instructor user', async () => {
    const agent = supertest.agent(app); // Using supertest.agent

    // Assuming you have a valid session for a non-instructor user
    const sessionData = {
      user: {
        uniqueID: 'kendell-163bc2e1', 
        accountType: 'student' 
      }
    };

    // Make the request with session data
    const response = await agent
      .get('/')
      .set('Cookie', ['your-session-cookie']) // Replace 'your-session-cookie' with your actual session cookie
      .send(sessionData);

    expect(response.status).toBe(200);
  });
});
