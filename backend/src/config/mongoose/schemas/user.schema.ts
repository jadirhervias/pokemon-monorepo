import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/authorization/role.enum';
import { MedalStates } from '../../../common/medals/medal-states.enum';
import * as bcrypt from 'bcrypt';

@Schema({ collection: 'users', timestamps: {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}})
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: MedalStates, default: undefined })
  medals: MedalStates[];

  @Prop({ default: undefined })
  pokemon_count: number;

  @Prop({ required: true, type: String, enum: Role })
  role: Role;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;
  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

export { UserSchema };
