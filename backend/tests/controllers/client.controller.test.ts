import prisma from '../../src/models/index';
import {
  fetchLatestOrganizationClientId,
  getClients,
  createClient,
  getClientById,
  editClient,
  fetchOrgClients,
  clientsByIdWihDeals,
  getUserClient,
} from '../../src/controllers/client.controller';

// Mock Prisma
jest.mock('../../src/models/index', () => ({
  __esModule: true,
  default: {
    client: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(), // Assuming count might be used by fetchOrgClients for pagination
    },
    // Mock other models if they are used directly in client.controller
  },
}));

describe('Client Controller', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (prisma.client.findFirst as jest.Mock).mockReset();
    (prisma.client.findMany as jest.Mock).mockReset();
    (prisma.client.create as jest.Mock).mockReset();
    (prisma.client.findUnique as jest.Mock).mockReset();
    (prisma.client.update as jest.Mock).mockReset();
    (prisma.client.count as jest.Mock).mockReset();
  });

  describe('fetchLatestOrganizationClientId', () => {
    const mockOrgId = 'org-test-id';

    it('should return the latest client ID if a client exists', async () => {
      const mockClient = {
        id: 'client-cuid',
        clientId: 'ORG-001',
      };
      (prisma.client.findFirst as jest.Mock).mockResolvedValue(mockClient);

      const result = await fetchLatestOrganizationClientId(mockOrgId);

      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: {
          organizationId: mockOrgId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          clientId: true,
        },
      });
      expect(result).toEqual(mockClient);
    });

    it('should return undefined if no client is found', async () => {
      (prisma.client.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await fetchLatestOrganizationClientId(mockOrgId);

      expect(prisma.client.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull(); // The function returns null if prisma returns null
    });

    it('should log an error and return undefined if Prisma throws an error', async () => {
      const mockError = new Error('Prisma connection failed');
      (prisma.client.findFirst as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await fetchLatestOrganizationClientId(mockOrgId);

      expect(prisma.client.findFirst).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined(); // Implicit return due to error

      consoleSpy.mockRestore();
    });
  });

  // More describe blocks for other functions will go here
});
