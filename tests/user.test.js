const mongoose = require('mongoose');
const User = require('../CodEd/model/user'); // Assuming UserModel.js is in the same directory


function generateRandomHex(length) {
    let result = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

describe('User Model', () => {
    beforeAll(async () => {
        // Connect to the test database before all tests

        const mongoose = require('mongoose');
        const uri = "mongodb+srv://test:test@coded.p7136aw.mongodb.net/?retryWrites=true&w=majority&appName=CodEd";

        const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


        try {
            // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
            await mongoose.connect(uri, clientOptions,{
                bufferCommands: false // disable buffering
            });
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch {
            console.dir
        }
    });

    afterAll(async () => {
        // Disconnect from the test database after all tests
        await mongoose.connection.close();
    });

    describe('Find instructor in the database', () => {
        it('should find an instructor in the database', async () => {
            try {
                const foundInstructor = await User.findOne({ username: 'instructor', accountType: 'instructor' });
                console.log(foundInstructor);
                expect(foundInstructor).toBeDefined();
                expect(foundInstructor.username).toBe('instructor');
                expect(foundInstructor.accountType).toBe('instructor');
            } catch (error) {
                 //console.error(error);
            }
        }, 60000);
    });
    

    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new User({ username: 'testUser' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            err = savedUserWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.message).toEqual('User validation failed: accountType: Path `accountType` is required.');
    });
});
