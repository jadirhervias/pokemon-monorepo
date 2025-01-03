import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from './role.enum';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  const createMockExecutionContext = (userRole: Role | undefined) => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {
            role: userRole,
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  it('should allow access if no roles are required', () => {
    const mockExecutionContext = createMockExecutionContext(Role.TRAINER);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should allow access if user has the required role (single role)', () => {
    const mockExecutionContext = createMockExecutionContext(Role.ADMIN);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.ADMIN);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should allow access if user has one of the required roles (array of roles)', () => {
    const mockExecutionContext = createMockExecutionContext(Role.TRAINER);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN, Role.TRAINER]);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should deny access if user does not have the required role (single role)', () => {
    const mockExecutionContext = createMockExecutionContext(Role.TRAINER);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.ADMIN);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(false);
  });

  it('should deny access if user does not have any of the required roles (array of roles)', () => {
    const mockExecutionContext = createMockExecutionContext(Role.TEST);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN, Role.TRAINER]);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(false);
  });

  it('should deny access if user is undefined', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: undefined,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.TRAINER);

    const canActivate = rolesGuard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(false);
  });
});
