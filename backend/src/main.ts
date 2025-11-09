import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      abortOnError: false,
    });
    
    // Enable CORS for frontend
    app.enableCors({
      origin: 'https://machine-monitoring-dahsboard.vercel.app',
      credentials: true,
    });

    await app.listen(3001);
    console.log('✅ Backend server running on http://localhost:3001');
    console.log('📝 Note: If you see MongoDB connection errors, update MONGODB_URI in .env file');
  } catch (error: any) {
    // If error is MongoDB related, still try to start the server
    if (error.message && (error.message.includes('Mongo') || error.message.includes('bad auth'))) {
      console.warn('⚠️  MongoDB connection failed, but starting server anyway...');
      console.warn('⚠️  Please update MONGODB_URI in .env file with your actual password');
      console.warn('⚠️  Database operations will fail until MongoDB is connected\n');
      
      // Try to create app again without MongoDB dependency (this won't work with current setup)
      // For now, just show the error and exit
      console.error('❌ Server cannot start without MongoDB connection');
      process.exit(1);
    } else {
      console.error('❌ Error starting server:', error.message);
      process.exit(1);
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  if (reason && reason.message && reason.message.includes('bad auth')) {
    console.warn('\n⚠️  MongoDB authentication failed');
    console.warn('⚠️  Please update MONGODB_URI in .env file\n');
    return;
  }
});

bootstrap();

