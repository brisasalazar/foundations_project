// Test Suite for User Service Layer

const userService = require('../src/service/userService');
const userDAO = require('../src/repository/userDAO');

// mock the repository layer (and functions)
jest.mock('../src/repository/userDAO.js', () => ({
  postUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByUsername: jest.fn(),
}));

describe("userService testing", () =>{
    afterEach(() => {
    jest.clearAllMocks();
    });

    
})