import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../config/mongoose/schemas/user.schema';
import { MedalEvaluationRequest } from '../config/mongoose/schemas/medal-evaluation-request.schema';
import { MedalEvaluationStatus } from '../common/medals/medal-evaluation-status.enum';
import { MedalState, MedalStateMachine } from '../common/medals/medal-states';
import { Role } from '../common/authorization/role.enum';

export type RequestAction = 'accept' | 'reject';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(MedalEvaluationRequest.name) private medalEvaluationRequestModel: Model<MedalEvaluationRequest>
  ) {}

  async getAdmindIds(): Promise<string[]> {
    const ids = await this.userModel.find({ role: Role.ADMIN }).distinct('_id').lean();
    const stringIds = ids.map((id: ObjectId) => id.toString());
    return stringIds;
  }

  async getPendingRequests(): Promise<Record<string, any>[]> {
    return await this.medalEvaluationRequestModel
      .find({
        status: MedalEvaluationStatus.PENDING,
      }, {
        id: "$_id",
        _id: 0,
        trainer_id: 1,
        trainer_username: 1,
        status: 1,
        medal: 1,
        pokemon_count: 1,
      }, {
        sort: { _id: -1 },
      })
      .exec();
  }

  async getHistoryRequests(): Promise<Record<string, any>[]> {
    return await this.medalEvaluationRequestModel
      .find(
        { status: { $ne: MedalEvaluationStatus.PENDING } },
        {
          id: "$_id",
          _id: 0,
          trainer_id: 1,
          trainer_username: 1,
          status: 1,
          medal: 1,
          pokemon_count: 1,
        }, {
          sort: { _id: -1 },
        }
      )
      .exec();
  }

  async processRequest(requestId: string, action: RequestAction): Promise<{
    trainer_pokemon_count: number;
    trainer_request_status: string;
    trainer_id: string;
    trainer_username: string;
    trainer_current_medal: MedalState | null;
    trainer_achieved_medals: MedalState[];
    trainer_next_medal: MedalState | null;
    items_processed: number;
  }> {
    const request = await this.medalEvaluationRequestModel.findOne({
      _id: requestId,
      status: MedalEvaluationStatus.PENDING,
    }).exec();

    if (!request) {
      throw new Error('Request not found');
    }

    const user = await this.userModel.findById(request.trainer_id);

    if (!user) {
      throw new Error('User not found');
    }

    const newPokemonCount = user.pokemon_count + request.pokemon_count;
    const medalState = MedalStateMachine.guestMedalState(user, request.pokemon_count);

    if (action === 'accept') {
      user.medals = medalState.achievedMedals.map(medal => medal.name);
      user.pokemon_count = newPokemonCount;

      await user.save();

      request.status = MedalEvaluationStatus.ACCEPTED;
    }

    if (action === 'reject') {
      request.status = MedalEvaluationStatus.REJECTED;
    }

    await request.save();

    return {
      items_processed: request.pokemon_count,
      trainer_id: request.trainer_id,
      trainer_username: user.username,
      trainer_current_medal: medalState.medal,
      trainer_next_medal: medalState.nextMedal,
      trainer_achieved_medals: medalState.achievedMedals,
      trainer_pokemon_count: newPokemonCount,
      trainer_request_status: request.status,
    };
  }
}
