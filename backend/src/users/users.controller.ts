import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../config/mongoose/schemas/user.schema';
import { Authorize } from '../common/authorization/authorize.decorator';
import { Role } from '../common/authorization/role.enum';

@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register-trainer')
    async registerTrainer(@Body() bodyDto: Record<string, any>): Promise<User> {
      return await this.usersService.register({
        username: bodyDto.username,
        password: bodyDto.password,
        role: Role.TRAINER,
      });
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register-admin')
    async registerAdmin(@Body() bodyDto: Record<string, any>): Promise<User> {
      return await this.usersService.register({
        username: bodyDto.username,
        password: bodyDto.password,
        role: Role.ADMIN,
      });
    }

    @Authorize()
    @Get('profile')
    async getProfile(@Request() req) {
      if (req.user.role === Role.ADMIN) {
        return req.user;
      }

      const trainerProfile = await this.usersService.getTrainerProfile(req.user.username);

      return {
        ...req.user,
        total_requested_medals: trainerProfile.total_requested_medals,
        pokemon_count: trainerProfile.pokemon_count,
        pending_pokemon_count: trainerProfile.pending_pokemon_count,
        achieved_medals: trainerProfile.achieved_medals.map(item => item.name),
        current_medal: trainerProfile.current_medal?.name ?? null,
        next_medal: trainerProfile.next_medal?.name ?? null,
        next_medal_threshold: trainerProfile.next_medal?.threshold ?? null,
      };
    }
}
