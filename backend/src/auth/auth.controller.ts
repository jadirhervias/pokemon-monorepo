import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../common/authorization/role.enum';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() bodyDto: Record<string, any>) {
    const { access_token, user: { id, username, role } } = await this.authService.signIn(bodyDto.username, bodyDto.password);
    let userData = { id, username, role };

    if (role === Role.TRAINER) {
      const trainerProfile = await this.usersService.getTrainerProfile(username);

      userData = {
        ...userData,
        total_requested_medals: trainerProfile.total_requested_medals,
        pokemon_count: trainerProfile.pokemon_count,
        pending_pokemon_count: trainerProfile.pending_pokemon_count,
        achieved_medals: trainerProfile.achieved_medals.map(item => item.name),
        current_medal: trainerProfile.current_medal?.name ?? null,
        next_medal: trainerProfile.next_medal?.name ?? null,
        next_medal_threshold: trainerProfile.next_medal?.threshold ?? null,
      } as any;
    }

    return {
      access_token,
      user: userData,
    };
  }
}
