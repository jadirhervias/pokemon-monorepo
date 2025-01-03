import { Role } from "./role.enum";

export interface CurrentUserClaims {
  id: string;
  username: string;
  role: Role;
}