import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  ownerAc,
  adminAc,
} from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  vehicle: ['create', 'read', 'update', 'delete'],
  order: ['create', 'read', 'update', 'delete'],
  driver: ['create', 'read', 'update', 'delete'],
  routing: ['use'],
  ai: ['use'],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  vehicle: ['create', 'read', 'update', 'delete'],
  order: ['create', 'read', 'update', 'delete'],
  driver: ['create', 'read', 'update', 'delete'],
  routing: ['use'],
  ai: ['use'],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  vehicle: ['create', 'read', 'update', 'delete'],
  order: ['create', 'read', 'update', 'delete'],
  driver: ['create', 'read', 'update', 'delete'],
  routing: ['use'],
  ai: ['use'],
});

export const driver = ac.newRole({
  order: ['read'],
  driver: ['read'],
});
