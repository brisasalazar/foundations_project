// Test Suite for Ticket Service Layer

const ticketService = require('../src/service/ticketService');
const ticketDAO = require('../src/repository/ticketDAO');

// mock the repository layer (and functions)
jest.mock('../src/repository/ticketDAO.js', () => ({
  putTicket: jest.fn(),
  getAllUserTickets: jest.fn(),
  editStatus: jest.fn(),
  filterPending: jest.fn(),
}));

describe("ticketService testing", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('submitTicket should call putTicket and return data', async () => {
    const mockTicket = { user_id: '1', description: 'Test', amount: 10 };
    ticketDAO.putTicket.mockResolvedValue({ ticket_id: 'abc', ...mockTicket });

    const result = await ticketService.submitTicket('1', mockTicket);
    expect(ticketDAO.putTicket).toHaveBeenCalledWith({ user_id: '1', ...mockTicket });
    expect(result).toHaveProperty('ticket_id', 'abc');
  });

  test('getAllUserTickets should call DAO and return data', async () => {
    ticketDAO.getAllUserTickets.mockResolvedValue([{ ticket_id: 'abc', user_id: '1' }]);
    const result = await ticketService.getAllUserTickets('1');
    expect(ticketDAO.getAllUserTickets).toHaveBeenCalledWith('1');
    expect(result).toEqual([{ ticket_id: 'abc', user_id: '1' }]);
  });

  test('editStatus should call DAO and return data', async () => {
    ticketDAO.editStatus.mockResolvedValue({ ticket_id: 'abc', status: 'approved' });
    const result = await ticketService.editStatus('1', 'abc', 'approved');
    expect(ticketDAO.editStatus).toHaveBeenCalledWith('1', 'abc', 'approved');
    expect(result).toHaveProperty('status', 'approved');
  });

  test('filterPending should call DAO and return data', async () => {
    ticketDAO.filterPending.mockResolvedValue([{ ticket_id: 'abc', status: 'pending' }]);
    const result = await ticketService.filterPending('pending');
    expect(ticketDAO.filterPending).toHaveBeenCalledWith('pending');
    expect(result[0]).toHaveProperty('status', 'pending');
  });
});