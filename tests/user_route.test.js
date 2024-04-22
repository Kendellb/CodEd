const supertest = require('supertest');
const app = require('../CodEd/app');
const User = require('../CodEd/model/user');


const request = supertest(app);

function generateRandomHex(length) {
  let result = '';
  const characters = '0123456789ABCDEF';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe('User Routes Test', () => {
    describe('POST /users/register - create new user', () => {
        test('201 Success register - should create new User', async () => {
            const username = `test_user${generateRandomHex(100)}`
            const response = await request
                .post('/users/register')
                .send({ username, accountType: "student" });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/users/login');
        });

        test('400 Failed register - should return error if username already exists', async () => {
            const existingUser = await User.findOne({ username: 'testuser', accountType: "student"});
            if (!existingUser) {
                await new User({ username: 'testuser' , accountType: "student" }).save();
            }

            const response = await request
                .post('/users/register')
                .send({ username: 'testuser' , accountType: "student"  });

            expect(response.status).toBe(400);
            expect(response.text).toBe('Username already exists');
        });
    });

        

    describe('POST /users/login - user login', () => {
        test('302 Success login - should redirect to /editor', async () => {
               const existingUser = await User.findOne({ username: 'kendell' });
            if (existingUser) {
                await new User({ username: 'kendell' , accountType: "student"  }).save();
            

            const response = await request
                .post('/users/login')
                .send({ username: 'kendell' , accountType: "student"  });

                //console.log(response);
                expect(response.status).toBe(302);
            expect(response.header.location).toBe('/editor');
            }
            
            
        });

        test('400 Failed login - should return "Invalid username"', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);

            const response = await request
                .post('/users/login')
                .send({ username: 'nonexistentuser' });

            expect(response.status).toBe(400);
            expect(response.text).toBe('Invalid username');
        });

        test('500 Failed login - should return internal server error', async () => {
            jest.spyOn(User, 'findOne').mockImplementation(() => {
                throw new Error('Internal server error');
            });

            const response = await request
                .post('/users/login')
                .send({ username: 'testuser' });

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });
    });
});