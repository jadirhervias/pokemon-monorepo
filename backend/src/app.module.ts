import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { TrainerModule } from './trainer/trainer.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfigService } from './config/mongoose/MongooseConfigService';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt/JwtConfigService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useClass: JwtConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    TrainerModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
