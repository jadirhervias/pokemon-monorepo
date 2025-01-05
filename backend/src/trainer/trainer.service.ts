import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { MedalEvaluationRequest } from '../config/mongoose/schemas/medal-evaluation-request.schema';
import { User } from '../config/mongoose/schemas/user.schema';
import { MedalEvaluationStatus } from '../common/medals/medal-evaluation-status.enum';
import { MedalStateMachine } from '../common/medals/medal-states';

interface PokemonRecord {
  POKEMON_ID: string;
  POKEMON_NAME: string;
  POKEMON_POWER: number;
};

@Injectable()
export class TrainerService {
  constructor(
    @InjectModel(MedalEvaluationRequest.name) private medalEvaluationRequestModel: Model<MedalEvaluationRequest>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getUserRequests(userId: string): Promise<any> {
    return await this.medalEvaluationRequestModel.find({ user_id: userId }).exec();
  }

  async processPokemonCSV(file: Buffer, userId: string): Promise<{
    medal: string;
    pokemonCount: number;
    requested: boolean;
    requestId: string;
    status: MedalEvaluationStatus;
    newMedalAchieved: boolean,
  }> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    let pokemonCount = 0;
    const bufferStream = new Readable();
    bufferStream.push(file);
    bufferStream.push(null);

    return new Promise((resolve, reject) => {
      bufferStream
        .pipe(csvParser())
        .on('data', async (data: PokemonRecord) => {
          pokemonCount++;
        })
        .on('end', async () => {
          try {
            const medalState = MedalStateMachine.guestMedalState(user, pokemonCount);
            const trainerAchievedNewMedal = medalState.medal && medalState.medal?.name !== user.medals.at(-1);

            const medalRequest = await this.medalEvaluationRequestModel.findOneAndUpdate(
              {
                trainer_id: userId,
                status: MedalEvaluationStatus.PENDING,
              },
              { 
                trainer_username: user.username,
                medal: medalState.medal?.name ?? medalState.nextMedal?.name,
                pokemon_count: pokemonCount,
              },
              {
                upsert: true,
                new: true,
              },
            );

            resolve({
              medal: medalState.medal?.name ?? medalState.nextMedal?.name,
              status: MedalEvaluationStatus.PENDING,
              pokemonCount: pokemonCount,
              requestId: medalRequest.id,
              newMedalAchieved: trainerAchievedNewMedal,
              requested: true,
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(error));
    });
  }
}
