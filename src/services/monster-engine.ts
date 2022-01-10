import * as sessionHelper from '@/app-lib/helper/session-helper';
import useMonsterSlayerService from "./monster-slayer-service";
import { IEnemy, IEnterDungeonResponse, ISkills } from '@/store/types';

export interface IMonsterEngine {
    genMonsterData: () => IEnemy;
    prepareAttack: () => ISkills;
}
export const useMonsterEngine = (): IMonsterEngine => {
    const service = useMonsterSlayerService();
    let monsData: IEnemy;

    const genMonsterData = ():IEnemy => {
        const dungeonInfo = sessionHelper.getSessionValue(sessionHelper.storageNames.onGoingDungeon) as IEnterDungeonResponse;
        monsData = dungeonInfo.enemy;
        return monsData;
    };
    const prepareAttack = (): ISkills => {
        if (!monsData) genMonsterData();
        return monsData.skills[service.randomAction(monsData.skills?.length)];
    };

    return {
        genMonsterData,
        prepareAttack
    };
}
export default useMonsterEngine;