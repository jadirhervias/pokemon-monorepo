import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { Role } from "./role.enum";
import { HasRole } from "./has-role.decorator";
import { RolesGuard } from "./roles.guard";

export function Authorize(roles?: Role | Role[]) {
  if (!roles) {
    return applyDecorators(UseGuards(AuthGuard));
  }

  return applyDecorators(HasRole(roles), UseGuards(AuthGuard, RolesGuard));
}