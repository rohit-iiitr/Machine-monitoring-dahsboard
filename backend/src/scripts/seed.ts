import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin user already exists
    const existingUser = await usersService.findByEmail('admin@example.com');
    
    if (existingUser) {
      console.log('Admin user already exists');
    } else {
      // Create default admin user
      await usersService.create('admin@example.com', 'password123');
      console.log('Admin user created successfully');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
    }
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

