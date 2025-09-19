// Test Suite for User Service Layer

const userService = require('../src/service/userService');
const userDAO = require('../src/repository/userDAO');

// mock the repository layer (and functions)
jest.mock('../src/repository/userDAO.js', () => ({
  postUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByUsername: jest.fn(),
}));

const dummyUsersTable = [
                            {user_id:1, username: "user1", password:"pass1", token: "someToken", role:"employee"},
                            {user_id:2, username: "user2", password:"pass2", token: "someToken", role:"manager"}
                        ];

describe("userService testing", () =>{
    afterEach(() => {
    jest.clearAllMocks();
    });
    
    describe('loginUser, Logging in functionality', () => {
        it('should return user when found', async () => {
          const mockUser = { user_id: 1, username: 'user1', password: 'pass1', role: 'employee' };
          userDAO.getUserByUsername.mockResolvedValue(mockUser);
    
          const result = await userService.loginUser('user1', "pass1");
          expect(userDAO.getUserByUsername).toHaveBeenCalledWith('user1');
          expect(result).toEqual(mockUser);
        });
    
        it('should return null when user not found', async () => {
          userDAO.getUserByUsername.mockResolvedValue(null);
    
          const result = await userService.loginUser('notfound', 'badPassword');
          expect(userDAO.getUserByUsername).toHaveBeenCalledWith('notfound');
          expect(result).toBeNull();
        });
      });
    
      describe('registerUser, Registering new user', () => {
        it('should return user data when creation is successful', async () => {
          const newUser = { user_id: 2, username: 'user2', password:'pass2', role: 'manager' };
          userDAO.postUser.mockResolvedValue(newUser);
    
          const result = await userService.registerUser(newUser);
          expect(userDAO.postUser).toHaveBeenCalledWith(newUser);
          expect(result).toEqual(newUser);
        });
    
        it('should return null when creation fails', async () => {
          userDAO.postUser.mockResolvedValue(null);
    
          const result = await userService.registerUser({ username: 'failuser' });
          expect(userDAO.postUser).toHaveBeenCalledWith({ username: 'failuser' });
          expect(result).toBeNull();
        });
      });
});