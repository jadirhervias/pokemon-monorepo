import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { TrainerService } from './trainer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { WebSocketGateway } from '../events/web-socket.gateway';
import { Authorize } from '../common/authorization/authorize.decorator';
import { CurrentUserClaims } from '../common/authorization/current-user-claims.interface';
import { CurrentUser } from '../common/authorization/current-user.decorator';
import { Role } from '../common/authorization/role.enum';
import { EventNames } from '../events/event-names.enum';
import { AdminService } from '../admin/admin.service';

@Controller('trainer')
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService,
    private readonly adminService: AdminService,
    private readonly eventsGateway: WebSocketGateway,
  ) {}

  @Authorize(Role.TRAINER)
  @UseInterceptors(FileInterceptor('pokemon_csv'))
  @HttpCode(HttpStatus.CREATED)
  @Post('request-medal-evaluation')
  async uploadPokemonCSV(
    @CurrentUser() user: CurrentUserClaims,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1024 * 20 })
        .addFileTypeValidator({ fileType: 'csv' })
        .build()
    ) pokemonCsv: Express.Multer.File
  ): Promise<{ medal: string;  requested: boolean; }> {
    const result = await this.trainerService.processPokemonCSV(pokemonCsv.buffer, user.id);
    const message = `El usuario ${user.username} ha solicitado asignación de medalla tipo ${result.medal}`;

    if (result.requested) {
      const adminIds = await this.adminService.getAdmindIds();
      this.eventsGateway.emitEvent(EventNames.MEDAL_EVALUATION_REQUESTED, {
        id: result.requestId,
        trainer_id: user.id,
        trainer_username: user.username,
        status: result.status,
        medal: result.medal,
        pokemon_count: result.pokemonCount,
      }, {
        message,
        userIds: adminIds,
      });
    }

    return result;
  }

  @Authorize(Role.TRAINER)
  @Get('requests')
  async getUserRequests(@CurrentUser() user: CurrentUserClaims): Promise<Record<string, any>[]> {
    return await this.trainerService.getUserRequests(user.id);
  }
}
