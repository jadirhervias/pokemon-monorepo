import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../config/mongoose/schemas/user.schema';
import { MedalEvaluationRequest, MedalEvaluationRequestSchema } from '../config/mongoose/schemas/medal-evaluation-request.schema';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: MedalEvaluationRequest.name, schema: MedalEvaluationRequestSchema },
      ]),
      EventsModule,
      UsersModule,
      AdminModule,
    ],
  providers: [TrainerService],
  controllers: [TrainerController]
})
export class TrainerModule {}
