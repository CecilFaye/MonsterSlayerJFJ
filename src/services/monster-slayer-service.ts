

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useRouter } from 'vue-router';
import * as sessionHelper from '@/app-lib/helper/session-helper';
import * as helper from '@/app-lib/helper/helper';
import Monsters from '@/app-lib/json/monsters.json';
import Player from '@/app-lib/json/player.json';
import { ActionTypes } from '@/store/modules/game/actions';
import { GetterTypes } from '@/store/modules/game/getters';
import { MutationTypes } from '@/store/modules/game/mutations';
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	ActivityStateOptions, CharacterTypes, IAccount, IAccountResponse, ICharacter, IDungeonResponse, IInventory, IItem,
	IPersonState, ISkills, PersonType, IStats, InfoKeyValue, Stats, IEquipment, IEquipmentRequest, IEnterDungeonRequest, IEnterDungeonResponse, IBattleRequest, IEnemy, IBattleResponse
} from '@/store/types';

import useMonsterSlayerRequest from './monster-slayer-request';
import { useStore } from 'vuex';
import { AttackType, IActionStat, IFightStat } from './battle-engine';

const heroIdleStance = require('@/assets/hero/playerAqua-idle.gif');
const heroAttackStance = require('@/assets/hero/playerBeast-attack.gif');
const heroFocusStance = require('@/assets/hero/playerBeast-focus.gif');
const heroSkillStance = require('@/assets/hero/playerBeast-attack.gif');

const monsterIdleStance = require('@/assets/monster/monsterPlant-idle.gif');
const monsterAttackStance = require('@/assets/monster/monsterPlant-attack.gif');
const monsterFocusStance = require('@/assets/monster/monsterPlant-focus.gif');
const monsterSkillStance = require('@/assets/monster/monsterPlant-attack.gif');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const playerActionImages = {
    [ActivityStateOptions.Idle]: heroIdleStance,
    [ActivityStateOptions.Attack]: heroAttackStance,
    [ActivityStateOptions.Focus]: heroFocusStance,
    [ActivityStateOptions.Heal]: heroFocusStance,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const monsterActionImages = {
    [ActivityStateOptions.Idle]: monsterIdleStance,
    [ActivityStateOptions.Attack]: monsterAttackStance,
    [ActivityStateOptions.Focus]: monsterFocusStance,
    [ActivityStateOptions.Heal]: monsterFocusStance,
};
export interface ICharInfoDisplay {
    key: string,
    base: number,
    bonus: number,
    total: number
}


export interface IMonsterSlayerService {
    initFromSession: () => void;
    randomAction: (limit: number) => number;
    getRandomMonsters: () => IEnemy;
    getCharacterImage: (personType: PersonType, type: ActivityStateOptions) => any;
    getCharacterTypeName: (characterTypeId: number) => string;
    getCharacterDetails: () => ICharacter;
    getCharacterSkills: () => ISkills[];
    getCharacterEquipment: () => IEquipment;
    getWinner: () => boolean;
    gameResult: () => void;
    getDungeons: () => IDungeonResponse[];
    getSkills: () => ISkills[];
    getInventory: () => IInventory[];
    getCharacterStats: () => ICharInfoDisplay[];
    logout: () => void;
    updateSkills: (skills: string[]) => Promise<void>;
    updateEquipment: (equipments: IEquipmentRequest) => Promise<void>;
    deleteEquipment: (itemId: string) => Promise<void>;
    skillTypeName: (type: string) => string;

    enterDungeon: (dungeonId: string) => Promise<void>;
    dungeonRaidResult: () => Promise<void>;
    getLatestFightResult: () => IBattleResponse;

    damageCompute: (charType: PersonType, char: ICharacter | IEnemy, stat: IActionStat) => IActionStat;
    statCompute: (charType: PersonType, char: ICharacter | IEnemy) => IFightStat;

    // Http Call
    signUp: (account: IAccount) => Promise<IAccountResponse | null>;
    loginRequest: (username: string, password: string) => Promise<IAccountResponse>;
}

export const useMonsterSlayerService = (): IMonsterSlayerService => {
    const request = useMonsterSlayerRequest();
    const store = useStore();
    const router = useRouter();
    const initFromSession = (): void => {
        store.commit('game/' + MutationTypes.setAccount, sessionHelper.getSessionValue<IAccount>(sessionHelper.storageNames.account));
        store.commit('game/' + MutationTypes.setCharacter, sessionHelper.getSessionValue<ICharacter>(sessionHelper.storageNames.character));
    };
    const randomAction = (limit: number): number => {
        return Math.floor(Math.random() * limit);
    };
    const statCompute = (charType: PersonType, char: ICharacter | IEnemy): IFightStat => {
        const stat = {} as IFightStat;
        const equipment = charType === PersonType.Player ? (char as ICharacter).equipment : null;

        const agi = char.stats.agi + (equipment?.armor?.bonus?.agi ?? 0 ) + (equipment?.weapon?.bonus?.agi ?? 0);
        const luk = char.stats.agi + (equipment?.armor?.bonus?.agi ?? 0 ) + (equipment?.weapon?.bonus?.agi ?? 0);
        const def = char.stats.agi + (equipment?.armor?.bonus?.agi ?? 0 ) + (equipment?.weapon?.bonus?.agi ?? 0);

        stat.evaHitRatePercentage = ((agi/150)*char.level) + (agi*0.08);
        stat.critRatePercentage = ((luk/150)*char.level) + (luk*0.08);
        stat.defReductionPercentage = ((def/150)*char.level) + (def*0.08);
        return stat;
    };
    const damageCompute = (charType: PersonType, char: ICharacter | IEnemy, stat: IActionStat): IActionStat => {
        const equipment = charType === PersonType.Player ? (char as ICharacter).equipment : null;
        if (stat.skill.type === 'P') {
            const off = char.stats.off + (equipment?.armor?.bonus?.off ?? 0 ) + (equipment?.weapon?.bonus?.off ?? 0);
            stat.normalDamage = off * (stat.skill.damage/100);
        } else {
            const int = char.stats.int + (equipment?.armor?.bonus?.int ?? 0 ) + (equipment?.weapon?.bonus?.int ?? 0);
            stat.normalDamage = int * (stat.skill.damage/100);
        }
        stat.critDamage = stat.normalDamage * 1.5;
        return stat;
    };
    const getRandomMonsters = (): IEnemy => {
        const dungeonInfo = sessionHelper.getSessionValue(sessionHelper.storageNames.onGoingDungeon) as IEnterDungeonResponse;
        return dungeonInfo.enemy;
    };
    const getCharacterImage = (personType: PersonType, type: ActivityStateOptions): any => {
        return personType === PersonType.Player ? playerActionImages[type] : monsterActionImages[type];
    };
    const getCharacterTypeName = (characterTypeId: number): string => {
        let stringName = '';
        Object.keys(CharacterTypes).forEach(type => {
            if (CharacterTypes[type] === characterTypeId) {
                stringName = type;
            }
        });
        return stringName;
    };
    const signUp = (account: IAccount): Promise<IAccountResponse | null> => {
        return request.signup(account);
    };
    const loginRequest = (username: string, password: string): Promise<IAccountResponse> => {
        return request.login(username, password)
        .then(result => {
            if (result) {
                const account = result as IAccount;
                return store.dispatch('game/' + ActionTypes.loadCharacterAsync, account)
                    .then(result => {
                        if (result) {
                            store.commit('game/' + MutationTypes.setAccount, account);
                        }
                        return account;
                    });
            }
            return result;
        })
    };
    const getCharacterDetails = (): ICharacter => {
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        return character;
    };
    const getCharacterStats = (): ICharInfoDisplay[] => {
        const allStats: ICharInfoDisplay[] = [];
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        const weaponBonus: IStats = character?.equipment?.weapon?.bonus;
        const armorBonus: IStats = character?.equipment?.armor?.bonus;

        Object.keys(Stats).map(key => {
            const wb = weaponBonus ? weaponBonus[key] ?? 0 : 0;
            const ab = armorBonus ? armorBonus[key] ?? 0 : 0;
            const info = {
                key,
                base: character.stats[key],
                bonus: wb + ab,
                total: character.stats[key] + wb + ab
            } as ICharInfoDisplay;
            allStats.push(info);
        });
        return allStats;
    };
    const getCharacterSkills = (): ISkills[] => {
        let character = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        return character.skills.sort((a,b) => helper.stringCompare(a.name, b.name));
    };
    const getCharacterEquipment = (): IEquipment => {
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        return character.equipment;
    };
    const getDungeons = (): IDungeonResponse[] => {
        let dungeons: IDungeonResponse[] = store.getters['game/' + GetterTypes.getDungeons]();
        if (!dungeons || !dungeons?.length) {
            dungeons = sessionHelper.getSessionValue(sessionHelper.storageNames.dungeons) as IDungeonResponse[];
            store.commit('game/' + MutationTypes.setDungeons, dungeons);
        }
        return dungeons;
    };
    const getSkills = (): ISkills[] => {
        let skills: ISkills[] = store.getters['game/' + GetterTypes.getSkills]();
        if (!skills || !skills?.length) {
            skills = sessionHelper.getSessionValue(sessionHelper.storageNames.skills) as ISkills[];
            store.commit('game/' + MutationTypes.setSkills, skills);
        }
        return skills.sort((a,b) => helper.stringCompare(a.name, b.name));
    };
    const updateSkills = (skills: string[]): Promise<void> => {
        const character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
        return store.dispatch('game/' + ActionTypes.updateSkillAsync, { characterId: character._id, skills})
        .then(() => store.dispatch('game/' + ActionTypes.loadCharacterAsync, { accountId: character.accountId }));
    };

    const updateEquipment = (equipments: IEquipmentRequest): Promise<void> => {
        const character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
        return store.dispatch('game/' + ActionTypes.updateEquipmentAsync, { characterId: character._id, equipments})
        .then(() => store.dispatch('game/' + ActionTypes.loadCharacterAsync, { accountId: character.accountId }));
    };

    const deleteEquipment = (itemId: string): Promise<void> => {
        const character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
        return store.dispatch('game/' + ActionTypes.deleteEquipmentAsync, { characterId: character._id, itemId })
        .then(() => store.dispatch('game/' + ActionTypes.refreshInventoryAsync, character._id ));
    };

    const skillTypeName = (type: string): string => type === 'P' ? 'Physical' : 'Magic';

    const getInventory = (): IInventory[] => {
        let inventory: IInventory[] = store.getters['game/' + GetterTypes.getInventory]();
        if (!inventory || !inventory?.length) {
            inventory = sessionHelper.getSessionValue(sessionHelper.storageNames.inventory) as IInventory[];
            store.commit('game/' + MutationTypes.setInventory, inventory);
        }
        return inventory;
    };

    const enterDungeon = (dungeonId: string): Promise<void> => {
        const character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
        return  store.dispatch('game/' + ActionTypes.enterDungeonAsync, { characterId: character._id, dungeonId } as IEnterDungeonRequest)
        .then((res: IEnterDungeonResponse) => {
            sessionHelper.saveSession(sessionHelper.storageNames.onGoingDungeon, res )
            return res;
        })
        .then((res: IEnterDungeonResponse) => {
            if (res) {
                router.push(`/game/transition`);
            }
        });
    };
    const dungeonRaidResult = (): Promise<void> => {
        const character = sessionHelper.getSessionValue(sessionHelper.storageNames.character) as ICharacter;
        const dungeonInfo = sessionHelper.getSessionValue(sessionHelper.storageNames.onGoingDungeon) as IEnterDungeonResponse;
        const battleRequest = {
            characterId: character._id,
            dungeonId: dungeonInfo.dungeon._id,
            enemyId: dungeonInfo.enemy._id
        } as IBattleRequest;

        return  store.dispatch('game/' + ActionTypes.dungeonRaidResultAsync, battleRequest)
        .then((result: IBattleResponse) => sessionHelper.saveSession(sessionHelper.storageNames.latestFightResult, result))
        .finally(() => store.dispatch('game/' + ActionTypes.loadCharacterAsync, { accountId: character.accountId }));
    };
    const getWinner = ():boolean => {
        return store.getters['game/' + GetterTypes.isWinner];
    };
    const getLatestFightResult = (): IBattleResponse => {
        return sessionHelper.getSessionValue(sessionHelper.storageNames.latestFightResult) as IBattleResponse;
    };
    const gameResult = (): void => {
        router.push('/game/fightresult');
    };
    const logout = () => {
        sessionHelper.clearAllSessionValues();
        setTimeout(() => router.push('/'), 1000);
    };

    return {
        initFromSession,
        randomAction,
        getRandomMonsters,
        getCharacterImage,
        getCharacterTypeName,
        getCharacterDetails,
        getCharacterSkills,
        getCharacterEquipment,
        getCharacterStats,
        getDungeons,
        getSkills,
        getInventory,
        getWinner,
        gameResult,
        skillTypeName,
        updateSkills,
        updateEquipment,
        deleteEquipment,
        enterDungeon,
        dungeonRaidResult,
        getLatestFightResult,

        statCompute,
        damageCompute,

        logout,
        signUp,
        loginRequest
    }
}
export default useMonsterSlayerService;