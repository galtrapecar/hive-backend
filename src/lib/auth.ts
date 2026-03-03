import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { ac, owner, admin, driver } from './permissions';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:5173'],
  plugins: [
    organization({
      allowUserToCreateOrganization: async (user) => {
        const driverMembership = await prisma.member.findFirst({
          where: { userId: user.id, role: 'driver' },
        });
        return !driverMembership;
      },
      organizationHooks: {
        async afterAcceptInvitation({ member, user, organization }) {
          await prisma.driverProfile.create({
            data: {
              memberId: member.id,
              organizationId: organization.id,
              fullName: user.name,
            },
          });
        },
      },
      organizationLimit: 5,
      creatorRole: 'owner',
      memberRole: 'driver',
      membershipLimit: 100,
      ac,
      roles: {
        owner,
        admin,
        driver,
      },
    }),
  ],
});
