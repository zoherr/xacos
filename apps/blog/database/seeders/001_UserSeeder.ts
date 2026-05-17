import { Seeder, Factory } from '@xacos/orm';
import { User } from '@xacos/auth';
import bcrypt from 'bcryptjs';

export default class UserSeeder extends Seeder {
  async run(): Promise<void> {
    // Admin user
    await User.create({
      name: 'Admin',
      email: 'admin@blog.demo',
      password: await bcrypt.hash('password', 12),
      role: 'admin',
      email_verified: true,
      email_verified_at: new Date(),
    } as any);

    // Demo authors
    await Factory.times(3).create(User as any, async () => ({
      name: Factory.faker.person.fullName(),
      email: Factory.faker.internet.email(),
      password: await bcrypt.hash('password', 12),
      role: 'user',
      email_verified: true,
      email_verified_at: new Date(),
    }));

    console.log('  ✓ Created 4 users (admin@blog.demo / password)');
  }
}
