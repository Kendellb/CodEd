/**
 * Represents a user in the system.
 */
class User {
    /**
     * Create a new User.
     * @param {string} userName - The username of the user.
     * @param {Number} userID - random Id for a user.
     */
    userName;
    #userID;
    constructor(userName) {
        this.userName = userName;
    }

    /**
     * Set the user ID.
     * @param {string} userName - The username of the user.
     * @example
     * user.userID = 'john'; // Sets the user ID
     */
    set userID(userName) {
        this.#userID = userName + Math.random();
    }

    /**
     * Get the user ID.
     * @returns {string} The user ID.
     * @example
     * const userID = user.userID; // Retrieves the user ID
     */
    get userID() {
        return this.#userID;
    }
}

module.exports = User;
