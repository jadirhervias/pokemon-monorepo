import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService, RequestAction } from './admin.service';
import { WebSocketGateway } from '../events/web-socket.gateway';
import { Authorize } from '../common/authorization/authorize.decorator';
import { MedalEvaluationStatus } from '../common/medals/medal-evaluation-status.enum';
import { Role } from '../common/authorization/role.enum';
import { EventNames } from '../events/event-names.enum';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventsGateway: WebSocketGateway,
  ) {}

  @Authorize(Role.ADMIN)
  @Get('requests')
  async getPendingRequests(): Promise<Record<string, any>[]> {
    return await this.adminService.getPendingRequests();
  }

  @Authorize(Role.ADMIN)
  @Get('requests-history')
  async getRequestsHistory(): Promise<Record<string, any>[]> {
    return await this.adminService.getHistoryRequests();
  }

  @Authorize(Role.ADMIN)
  @Post('process-medal-request')
  async processMedalRequest(
    @Body() bodyDto: { request_id: string; action: RequestAction }
  ): Promise<{ message: string; request_status: string }> {
    const result = await this.adminService.processRequest(bodyDto.request_id, bodyDto.action);
    const lastAchievedMedal = result.trainer_achieved_medals.at(-1);
    const message = `Felicitaciones, ${result.trainer_username}. Te han asignado tu nueva medalla de tipo ${lastAchievedMedal.name}`;

    if (result.trainer_request_status === MedalEvaluationStatus.ACCEPTED) {
      this.eventsGateway.emitEvent(
        EventNames.NEW_MEDAL_AWARDED,
        {
          next_medal: result.trainer_next_medal?.name,
          next_medal_threshold: result.trainer_next_medal?.threshold,
          new_pokemon_count: result.trainer_pokemon_count,
        },
        {
          message,
          userIds: result.trainer_id,
        }
      );
    }

    return { message, request_status: result.trainer_request_status };
  }
}
