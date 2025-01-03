import { MedalState } from "./medal-states";
import { MedalStates } from "./medal-states.enum";

export class MedalFactory {
  private static readonly medalDefinitions: { type: MedalStates; threshold: number }[] = [
    { type: MedalStates.WOOD, threshold: 10 },
    { type: MedalStates.IRON, threshold: 15 },
    { type: MedalStates.BRONZE, threshold: 25 },
    { type: MedalStates.SILVER, threshold: 40 },
    { type: MedalStates.GOLD, threshold: 60 },
    { type: MedalStates.PLATINUM, threshold: 85 },
    { type: MedalStates.DIAMOND, threshold: 115 },
    { type: MedalStates.IMMORTAL, threshold: 150 },
    { type: MedalStates.RADIANT, threshold: 190 },
  ];

  private static medalsMap: Record<MedalStates, MedalState> | null = null;

  private static getMedalsMap(): Record<MedalStates, MedalState> {
    if (!this.medalsMap) {
      this.medalsMap = this.buildMedalMap();
    }
    return this.medalsMap;
  }

  private static buildMedalMap(): Record<MedalStates, MedalState> {
    const medalsMap: Record<MedalStates, MedalState> = {} as Record<MedalStates, MedalState>;
    let nextMedal: MedalState | null = null;

    for (let i = this.medalDefinitions.length - 1; i >= 0; i--) {
      const { type, threshold } = this.medalDefinitions[i];
      const medal = new MedalState(type, threshold, nextMedal);
      medalsMap[type] = medal;
      nextMedal = medal;
    }

    return medalsMap;
  }

  static build(type: MedalStates): MedalState {
    const medalsMap = this.getMedalsMap();
    const medal = medalsMap[type];

    if (!medal) {
      throw new Error("Invalid medal type");
    }

    return medal;
  }
}
