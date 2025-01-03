import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../config/mongoose/schemas/user.schema';
import { EventsModule } from '../events/events.module';
import { MedalEvaluationRequest, MedalEvaluationRequestSchema } from '../config/mongoose/schemas/medal-evaluation-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MedalEvaluationRequest.name, schema: MedalEvaluationRequestSchema },
    ]),
    EventsModule,
    UsersModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
