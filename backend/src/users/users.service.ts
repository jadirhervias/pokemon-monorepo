import { Injectable } from '@nestjs/common';
import { User } from '../config/mongoose/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedalState } from '../common/medals/medal-states';
import { Role } from '../common/authorization/role.enum';
import { MedalEvaluationRequest } from '../config/mongoose/schemas/medal-evaluation-request.schema';
import { MedalEvaluationStatus } from '../common/medals/medal-evaluation-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(MedalEvaluationRequest.name) private medalEvaluationRequestModel: Model<MedalEvaluationRequest>
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username }).exec();
  }

  async getTrainerProfile(username: string): Promise<{
    current_medal: MedalState | null;
    next_medal: MedalState | null;
    achieved_medals: MedalState[];
    pokemon_count: number;
    pending_pokemon_count: number;
    total_requested_medals: number;
  }> {
    const trainerMedalRequests = await this.medalEvaluationRequestModel.find({
      trainer_username: username,
    }, {
      _id: 1,
      status: 1,
      pokemon_count: 1,
    }, {
      sort: { _id: -1 },
    }).lean();

    const pendingRequest = trainerMedalRequests.find(request => request.status === MedalEvaluationStatus.PENDING);

    const trainer = await this.userModel
      .findOne({
        username,
        role: Role.TRAINER,
      }, {
        id: '$_id',
        medals: 1,
        pokemon_count: 1,
        current_medal: { 
          $arrayElemAt: ["$medals", -1],
        },
      })
      .exec();

    const rawPokemonCount = trainer ? (trainer as any)?.pokemon_count : null;
    const pokemonCount = rawPokemonCount ? rawPokemonCount as number : 0;

    const trainerMedalState = MedalState.fromUser(trainer);

    return {
      total_requested_medals: trainerMedalRequests.length,
      pokemon_count: pokemonCount,
      pending_pokemon_count: pendingRequest?.pokemon_count ?? 0,
      achieved_medals: trainerMedalState.achieved_medals,
      current_medal: trainerMedalState.current_medal,
      next_medal: trainerMedalState.next_medal,
    };
  }

  async getTotalEvaluatedMedalRequests(username: string): Promise<number> {
    return this.medalEvaluationRequestModel.countDocuments({
      trainer_username: username,
    }).exec();
  }

  async register(data: {
    username: string;
    password: string;
    role: Role;
  }): Promise<User> {
    const USER_DATA_BY_ROLE = {
      [Role.TRAINER]: {
        ...data,
        medals: [],
        pokemon_count: 0,
      },
      [Role.ADMIN]: data,
    };

    return await this.userModel.create(USER_DATA_BY_ROLE[data.role] ?? data);
  }
}
