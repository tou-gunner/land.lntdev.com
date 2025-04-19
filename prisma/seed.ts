import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      fullname: 'Administrator',
      role: 'admin',
      phone: '+1234567890',
    },
  });
  console.log(`Created admin user with ID: ${admin.gid}`);

  // Create regular user
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      fullname: 'Regular User',
      role: 'page grouping',
      phone: '+0987654321',
    },
  });
  console.log(`Created regular user with ID: ${user.gid}`);

  // Create sample inactive user
  const inactivePassword = await hash('inactive123', 10);
  const inactive = await prisma.user.upsert({
    where: { username: 'inactive' },
    update: {},
    create: {
      username: 'inactive',
      password: inactivePassword,
      fullname: 'Inactive User',
      role: 'page grouping',
      is_active: false,
      phone: '+1122334455',
    },
  });
  console.log(`Created inactive user with ID: ${inactive.gid}`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 