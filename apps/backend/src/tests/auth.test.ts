import { AuthService } from '../modules/auth/auth.service';
import prisma from '../utils/prisma';

jest.mock('../utils/prisma', () => ({
  user: {
    findUnique: jest.fn(),
  },
  session: {
    create: jest.fn(),
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw an error for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(AuthService.login({ email: 'test@test.com', password: 'password' }, '127.0.0.1', 'test device'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});
