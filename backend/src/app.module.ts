import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/machine-monitoring';
        
        // Check if password placeholder is still in URI
        if (uri.includes('<db_password>')) {
          console.warn('⚠️  WARNING: MongoDB password placeholder detected in MONGODB_URI');
          console.warn('⚠️  Please replace <db_password> with your actual MongoDB password in .env file');
        }
        
        return {
          uri,
          retryWrites: true,
          w: 'majority',
          // Connection options
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          // Retry connection attempts
          maxPoolSize: 10,
          minPoolSize: 1,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MachinesModule,
    UsersModule,
  ],
})
export class AppModule {}

