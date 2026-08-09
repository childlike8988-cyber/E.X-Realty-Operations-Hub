import type { Role } from '@/types/auth';
export function canAccess(allowedRoles: Role[], role: Role){ return allowedRoles.includes(role) || role === 'SUPER_ADMIN'; }
