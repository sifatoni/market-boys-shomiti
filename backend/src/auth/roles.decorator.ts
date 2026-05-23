import { SetMetadata } from '@nestjs/common';

export interface Role {
  ADMIN: string;
  MEMBER: string;
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
