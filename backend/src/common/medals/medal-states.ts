import { User } from "../../config/mongoose/schemas/user.schema";
import { MedalStates } from "./medal-states.enum";
import { MedalFactory } from "./medal-factory";

export class MedalState {
  constructor(
    public name: MedalStates,
    public threshold: number,
    public next?: MedalState,
  ) {}

  static fromUser(user: User): {
    current_medal: MedalState | null;
    next_medal: MedalState | null;
    achieved_medals: MedalState[];
  } {
    const resolvedMedal = MedalStateMachine.guestMedalState(user, 0);

    return {
      current_medal: resolvedMedal.medal,
      next_medal: resolvedMedal.nextMedal,
      achieved_medals: resolvedMedal.achievedMedals,
    };
  }

  guestMedalState(user: User, requestedCount: number): {
    medal: MedalState | null;
    nextMedal: MedalState | null;
    achievedMedals: MedalState[];
  } {
    const newCount = user.pokemon_count + requestedCount;
    const achievedMedals: MedalState[] = [];
    let currentStateIterable: MedalState | null = this;
    let currentState: MedalState | null = null;
    let nextState: MedalState | null = this.next;

    while (currentStateIterable && newCount >= currentStateIterable.threshold) {
      currentState = currentStateIterable;
      nextState = currentState.next;

      achievedMedals.push(currentStateIterable);

      if (currentStateIterable.next && (newCount < currentStateIterable.next.threshold)) {
        break;
      }

      currentStateIterable = currentStateIterable.next;
    }

    return {
      medal: currentState,
      nextMedal: currentState ? nextState : currentStateIterable,
      achievedMedals,
    };
  }
}

export const MedalStateMachine = MedalFactory.build(MedalStates.WOOD);