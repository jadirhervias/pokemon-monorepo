import { Role } from "./utils/roles";

export type UserProfile = {
  id: string;
  username: string;
} & (AdminProfile | TrainerProfile)

export type AdminProfile = {
  role: Role.ADMIN;
}

export type TrainerProfile = {
  role: Role.TRAINER;
  achieved_medals: string[],
  current_medal: string | null;
  next_medal: string | null;
  next_medal_threshold: number | null;
  pokemon_count: number;
  pending_pokemon_count: number;
  total_requested_medals: number;
}

export type MedalRequest = {
  id: string,
  trainer_id: string,
  trainer_username: string,
  status: string,
  medal: string,
  pokemon_count: number,
}

export type MedalAccepted = {
  next_medal: string,
  new_pokemon_count: number,
  next_medal_threshold: number,
}
