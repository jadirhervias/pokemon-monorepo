import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { Role } from './role.enum';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    authGuard = new AuthGuard(jwtService);
  });

  it('should return true if token is valid', async () => {
    const mockExecutionContext = createMockExecutionContext(
      'Bearer validToken'
    );

    const tokenPayload = {
      sub: '6770af1363c2fbe8ba8d511b',
      username: 'user123',
      role: Role.TRAINER,
      iat: 1735531843,
      exp: 1735535443,
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(tokenPayload);

    const canActivate = await authGuard.canActivate(mockExecutionContext);

    expect(canActivate).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('validToken', {
      secret: expect.any(String),
    });

    const request = mockExecutionContext.switchToHttp().getRequest();
    expect(request.user).toEqual({
      id: tokenPayload.sub,
      username: tokenPayload.username,
      role: tokenPayload.role,
    });
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockExecutionContext = createMockExecutionContext(
      'Bearer invalidToken'
    );

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException
    );

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalidToken', {
      secret: expect.any(String),
    });
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockExecutionContext = createMockExecutionContext(undefined);

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException
    );
  });
});

// Utility function to create a mock ExecutionContext
function createMockExecutionContext(authorizationHeader: string | undefined): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: authorizationHeader,
        },
        user: null,
      }),
    }),
    // Mock other ExecutionContext methods if needed
  } as unknown as ExecutionContext;
}
