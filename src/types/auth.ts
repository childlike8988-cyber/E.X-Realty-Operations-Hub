export const roles = ['SUPER_ADMIN','ADMIN','MEDIA','SALES','MANAGER','VIEWER'] as const;
export type Role = typeof roles[number];
