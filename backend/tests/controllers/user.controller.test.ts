import { userLogin, createUser } from '../../src/controllers/user.controller';
import prisma from '../../src/models/index'; // Assuming default export for prisma client
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  LoginInputType,
  CreateUserInputArgs,
  CreateUserReturnType,
  CreatedUserData
} from '../../src/types/UserTypes';

// Mock the dependencies
jest.mock('../../src/models/index', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    // Mock other prisma models if they are directly used and not through user relations
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock environment variables
process.env.JWT_LOGIN_SECRET = 'test-secret';

describe('User Controller - userLogin', () => {
  const mockUserInput: LoginInputType = {
    input: {
      email: 'test@example.com',
      password: 'password123',
    },
  };

  beforeEach(() => {
    // Clear mocks if not handled globally or if more specific control is needed
    (prisma.user.findFirst as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
    (jwt.sign as jest.Mock).mockReset();
  });

  it('should login a user successfully and return a token', async () => {
    const mockUser = {
      id: 'user-cuid',
      email: 'test@example.com',
      userId: 'testUser123',
      password: 'hashedPassword',
      fullName: 'Test User',
      role: [{ role: { roleName: 'user' } }], // Ensure this matches actual structure
      team: { id: 'team-cuid', teamId: 'team123', teamName: 'Test Team' },
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked-jwt-token');

    const result = await userLogin(mockUserInput);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: expect.any(Object),
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'user-cuid', role: 'user' }, // Assuming role is extracted this way
      'test-secret',
      { expiresIn: '7d'} // Assuming your actual controller adds this
    );
    expect(result.status.success).toBe(true);
    expect(result.status.message).toBe('Login Success');
    expect(result.token).toBe('mocked-jwt-token');
    // Adjust result.user assertion based on actual LoginReturnType
    // If LoginReturnType has a user object similar to the mockUser:
    // expect(result.user).toEqual(expect.objectContaining({ id: 'user-cuid' }));
    // For now, we'll assume the structure from previous tests
    expect(result.user).toEqual(mockUser);
    expect(result.role).toBe('user');
  });

  it('should return error if user is not found', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    const result = await userLogin(mockUserInput);
    expect(result.status.success).toBe(false);
    expect(result.status.message).toBe('Invalid email or password');
  });

  it('should return error if password does not match', async () => {
    const mockUser = { id: 'user-cuid', password: 'hashedPassword', role: [{ role: { roleName: 'user' } }] };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await userLogin(mockUserInput);
    expect(result.status.success).toBe(false);
    expect(result.status.message).toBe('Invalid email or password');
  });

  it('should handle user with no role gracefully', async () => {
    const mockUserNoRole = {
        id: 'user-cuid-no-role',
        email: 'testnorole@example.com',
        userId: 'testNoRole123',
        password: 'hashedPassword',
        fullName: 'Test User No Role',
        role: [], // Empty role array
        team: null,
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserNoRole);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked-jwt-token-no-role');

      const result = await userLogin({ input: { email: 'testnorole@example.com', password: 'password123'}});

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user-cuid-no-role', role: null },
        'test-secret',
        { expiresIn: '7d'}
      );
      expect(result.status.success).toBe(true);
      expect(result.role).toBeNull();
  });
});

describe('User Controller - createUser', () => {
  const mockOrgId = 'org-cuid';

  const mockCreateUserInputArgs: CreateUserInputArgs = {
    input: {
      email: 'newuser@example.com',
      fullName: 'New User',
      password: 'password123',
      userId: 'newuser123',
      roleId: 'role-cuid-for-user', // createUser expects roleId
      teamId: 'team-cuid-optional',
    },
  };

  const mockAdminUserInputArgs: CreateUserInputArgs = {
    input: {
      email: 'newadmin@example.com',
      fullName: 'New Admin',
      password: 'password123',
      userId: 'newadmin123',
      roleId: 'role-cuid-for-admin', // createUser expects roleId
    }
  };

  beforeEach(() => {
    (prisma.user.findFirst as jest.Mock).mockReset();
    (prisma.user.create as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
    // No need to mock prisma.role.findUnique for createUser if it directly uses roleId
  });

  it('should create a new user successfully', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null); // No existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const mockReturnedUserData: CreatedUserData = { // This is what prisma.user.create is mocked to return
      id: 'new-user-cuid',
      email: mockCreateUserInputArgs.input.email,
      fullName: mockCreateUserInputArgs.input.fullName,
      userId: mockCreateUserInputArgs.input.userId,
      role: [{ roleId: mockCreateUserInputArgs.input.roleId, role: { roleName: 'user' } }], // Example role structure
      team: { teamId: 'team-cuid-optional', teamName: 'Optional Team' }, // Example team structure
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockReturnedUserData);

    const result: CreateUserReturnType = await createUser(mockCreateUserInputArgs, mockOrgId);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: mockCreateUserInputArgs.input.email, organizationId: mockOrgId },
          { fullName: mockCreateUserInputArgs.input.fullName, organizationId: mockOrgId },
        ],
      },
      select: { id: true, email: true, fullName: true },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserInputArgs.input.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: mockCreateUserInputArgs.input.email,
        fullName: mockCreateUserInputArgs.input.fullName.trim(),
        password: 'hashedPassword',
        organizationId: mockOrgId,
        userId: mockCreateUserInputArgs.input.userId,
        teamId: mockCreateUserInputArgs.input.teamId,
        role: {
          create: [{ roleId: mockCreateUserInputArgs.input.roleId }],
        },
      },
      select: expect.any(Object),
    });
    expect(result.status.success).toBe(true);
    expect(result.status.message).toBe('User Created Successfully');
    if (result.status.success) {
      expect(result.data).toEqual(mockReturnedUserData);
    }
  });

  it('should return error if email already exists (checked by findFirst)', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existing-user-cuid', email: mockCreateUserInputArgs.input.email, fullName: 'Some Other Name' });
    const result = await createUser(mockCreateUserInputArgs, mockOrgId);

    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(result.status.success).toBe(false);
    // Message from controller: "User with this email already exists"
    expect(result.status.message).toMatch(/User with this email already exists/i);
  });

  it('should return error if full name already exists (checked by findFirst)', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existing-user-cuid', email: 'other@email.com', fullName: mockCreateUserInputArgs.input.fullName });
    const result = await createUser(mockCreateUserInputArgs, mockOrgId);
    expect(result.status.success).toBe(false);
    // Message from controller: "User with this name already exists"
    expect(result.status.message).toMatch(/User with this name already exists/i);
  });

  it('should handle Prisma unique constraint violation (P2002) on create', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    // Simulate Prisma P2002 error for email (example)
    const prismaError = { code: 'P2002', meta: { target: ['email'] } };
    (prisma.user.create as jest.Mock).mockRejectedValue(prismaError);

    const result = await createUser(mockCreateUserInputArgs, mockOrgId);

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(result.status.success).toBe(false);
    // Message from controller's P2002 handling for email
    expect(result.status.message).toMatch(/Email already exists/i);
  });

   it('should create a new admin user successfully', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPasswordAdmin');

    const mockReturnedAdminData: CreatedUserData = {
      id: 'new-admin-cuid',
      email: mockAdminUserInputArgs.input.email,
      fullName: mockAdminUserInputArgs.input.fullName,
      userId: mockAdminUserInputArgs.input.userId,
      role: [{ roleId: mockAdminUserInputArgs.input.roleId, role: { roleName: 'admin' } }],
      team: null,
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockReturnedAdminData);

    const result: CreateUserReturnType = await createUser(mockAdminUserInputArgs, mockOrgId);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: mockAdminUserInputArgs.input.email,
        fullName: mockAdminUserInputArgs.input.fullName.trim(),
        password: 'hashedPasswordAdmin',
        organizationId: mockOrgId,
        userId: mockAdminUserInputArgs.input.userId,
        role: { create: [{ roleId: mockAdminUserInputArgs.input.roleId }] },
      }),
      select: expect.any(Object),
    });
    expect(result.status.success).toBe(true);
    expect(result.status.message).toBe('User Created Successfully');
    if (result.status.success) {
      expect(result.data).toEqual(mockReturnedAdminData);
    }
  });
});