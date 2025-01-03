import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MedalStates } from '../../../common/medals/medal-states.enum';
import { MedalEvaluationStatus } from '../../../common/medals/medal-evaluation-status.enum';

@Schema({ collection: 'medal_evaluation_requests', timestamps: {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}})
export class MedalEvaluationRequest extends Document {
  @Prop({ required: true })
  trainer_id: string;

  @Prop({ required: true })
  trainer_username: string;

  @Prop({ required: true, type: String, enum: MedalStates })
  medal: MedalStates;

  @Prop({ default: 0 })
  pokemon_count: number;

  @Prop({
    required: true,
    type: String,
    enum: MedalEvaluationStatus,
    default: MedalEvaluationStatus.PENDING
  })
  status: MedalEvaluationStatus;
}

export const MedalEvaluationRequestSchema = SchemaFactory.createForClass(MedalEvaluationRequest);
