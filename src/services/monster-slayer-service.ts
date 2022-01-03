

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useRouter } from 'vue-router';
import * as helper from '@/app-lib/helper/session-helper';
import Monsters from '@/app-lib/json/monsters.json';
import Player from '@/app-lib/json/player.json';
import { ActionTypes } from '@/store/modules/game/actions';
import { GetterTypes } from '@/store/modules/game/getters';
import { MutationTypes } from '@/store/modules/game/mutations';
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	ActivityStateOptions, CharacterTypes, IAccount, IAccountResponse, ICharacter, IDungeonResponse, IInventory, IItem,
	IPersonState, ISkills, PersonType, IStats, InfoKeyValue, Stats, IEquipment
} from '@/store/types';

import useMonsterSlayerRequest from './monster-slayer-request';
import { useStore } from 'vuex';

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
    [ActivityStateOptions.Skill1]: heroSkillStance,
    [ActivityStateOptions.Skill2]: heroFocusStance,
    [ActivityStateOptions.Skill3]: heroSkillStance,
    // Assign an image for failed attack
    [ActivityStateOptions.Failed]: heroIdleStance
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const monsterActionImages = {
    [ActivityStateOptions.Idle]: monsterIdleStance,
    [ActivityStateOptions.Attack]: monsterAttackStance,
    [ActivityStateOptions.Focus]: monsterFocusStance,
    [ActivityStateOptions.Skill1]: monsterSkillStance,
    [ActivityStateOptions.Skill2]: monsterSkillStance,
    [ActivityStateOptions.Skill3]: monsterSkillStance,
    // Assign an image for failed attack
    [ActivityStateOptions.Failed]: monsterIdleStance
};
export interface ICharInfoDisplay {
    key: string,
    base: number,
    bonus: number,
    total: number
}

export interface IMonsterSlayerService {
    initFromSession: () => void;
    getDefaultPerson: (type: PersonType) => IPersonState;
    randomAction: (limit: number) => number;
    initOptions: (person: IPersonState) => IPersonState;
    getRandomMonsters: () => IPersonState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCharacterImage: (personType: PersonType, type: ActivityStateOptions) => any;
    getCharacterTypeName: (characterTypeId: number) => string;
    getCharacterDetails: () => ICharacter;
    getCharacterSkills: () => ISkills[];
    getCharacterEquipment: () => IEquipment;
    getWinner: () => boolean;
    gameReset: () => void;
    gameInit: () => void;
    gameResult: () => void;
    battleStart: () => boolean;
    getDungeons: () => IDungeonResponse[];
    getSkills: () => ISkills[];
    getInventory: () => IInventory[];
    getCharacterStats: () => InfoKeyValue[];
    logout: () => void;
    updateSkills: (skills: string[]) => Promise<void>;

    // Http Call
    signUp: (account: IAccount) => Promise<IAccountResponse | null>;
    loginRequest: (username: string, password: string) => Promise<IAccountResponse>;
}

export const useMonsterSlayerService = (): IMonsterSlayerService => {
    const request = useMonsterSlayerRequest();
    const store = useStore();
    const router = useRouter();
    const initFromSession = (): void => {
        store.commit('game/' + MutationTypes.setAccount, helper.getSessionValue<IAccount>(helper.storageNames.account));
        store.commit('game/' + MutationTypes.setCharacter, helper.getSessionValue<ICharacter>(helper.storageNames.character));
    };

    const randomAction = (limit: number): number => {
        return Math.floor(Math.random() * limit);
    };
    const getDefaultPerson = (type: PersonType): IPersonState => {
        let personState: IPersonState;
        switch(type) {
            case PersonType.Player:
                personState = Player as IPersonState;
                personState.turn = true;
                break;
            case PersonType.Monsters:
                personState = getRandomMonsters();
                personState.turn = false;
                break;
        }
        return initOptions(personState);
    };
    const getRandomMonsters = (): IPersonState => {
        const monsters = Monsters as IPersonState[];
        return monsters[randomAction(Monsters.length-1)];
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
    const initOptions = (person: IPersonState): IPersonState => {
        person.currentState = {
            health: person.maxHealth,
            mana: person.maxMana,

            activityState: ActivityStateOptions.Idle,
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _) as ActivityStateOptions[]
        };
        return person;
    };
    const getCharacterImage = (personType: PersonType, type: ActivityStateOptions): any => {
        return personType === PersonType.Player ? playerActionImages[type] : monsterActionImages[type];
    };

    const signUp = (account: IAccount): Promise<IAccountResponse | null> => {
        return request.signup(account);
    };

    const loginRequest = (username: string, password: string): Promise<IAccountResponse> => {
        return request.login(username, password)
        .then(result => {
            if (result) {
                const account = result as IAccount;
                return store.dispatch('game/' + ActionTypes.loadCharacterAsync, account.accountId)
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
    const gameInit = (): void => {
        store.commit(MutationTypes.initFirstTurn, null);
    };
    const battleStart = (): boolean => store.state.battleStart;
    const getCharacterDetails = (): ICharacter => {
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = helper.getSessionValue(helper.storageNames.character) as ICharacter;
            store.commit(MutationTypes.setCharacter, character);
        }
        return character;
    };
    const getCharacterStats = (): InfoKeyValue[] => {
        const allStats: ICharInfoDisplay[] = [];
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = helper.getSessionValue(helper.storageNames.character) as ICharacter;
            store.commit(MutationTypes.setCharacter, character);
        }
        const weaponBonus: IStats = character.equipment.weapon.bonus;
        const armorBonus: IStats = character.equipment.armor.bonus;
        Object.keys(Stats).map(key => {
            const info = {
                key,
                base: character.stats[key],
                bonus: weaponBonus[key] + armorBonus[key],
                total: character.stats[key] + weaponBonus[key] + armorBonus[key]
            } as ICharInfoDisplay;
            allStats.push(info);
        });
        return allStats;
    };
    const getCharacterSkills = (): ISkills[] => {
        let character = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = helper.getSessionValue(helper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        return character.skills;
    };
    const getCharacterEquipment = (): IEquipment => {
        let character: ICharacter = store.getters['game/' + GetterTypes.getState]('character');
        if (!character || !character?._id) {
            character = helper.getSessionValue(helper.storageNames.character) as ICharacter;
            store.commit('game/' + MutationTypes.setCharacter, character);
        }
        return character.equipment;
    };
    const getDungeons = (): IDungeonResponse[] => {
        let dungeons: IDungeonResponse[] = store.getters['game/' + GetterTypes.getDungeons]();
        if (!dungeons || !dungeons?.length) {
            dungeons = helper.getSessionValue(helper.storageNames.dungeons) as IDungeonResponse[];
            store.commit('game/' + MutationTypes.setDungeons, dungeons);
        }
        return dungeons;
    };
    const getSkills = (): ISkills[] => {
        let skills: ISkills[] = store.getters['game/' + GetterTypes.getSkills]();
        if (!skills || !skills?.length) {
            skills = helper.getSessionValue(helper.storageNames.skills) as ISkills[];
            store.commit('game/' + MutationTypes.setSkills, skills);
        }
        return skills;
    };
    const updateSkills = (skills: string[]): Promise<void> => {
        const account = sessionStorage.getItem(helper.storageNames.account);
        return store.dispatch('game/' + ActionTypes.updateSkillAsync, skills)
        .then(() => store.dispatch('game/' + ActionTypes.loadCharacterAsync, account));
    };

    const getInventory = (): IInventory[] => {
        let inventory: IInventory[] = store.getters['game/' + GetterTypes.getInventory]();
        if (!inventory || !inventory?.length) {
            inventory = helper.getSessionValue(helper.storageNames.inventory) as IInventory[];
            store.commit('game/' + MutationTypes.setInventory, inventory);
        }
        return inventory;
    };
    const getWinner = ():boolean => {
        return store.getters['game' + GetterTypes.isWinner]();
    };
    const gameReset = (): void => store.commit('game/' + MutationTypes.reset, getDefaultPerson);
    const gameResult = (): void => {
        router.push('/game/fightresult');
    };
    const logout = () => {
        helper.clearAllSessionValues();
        setTimeout(() => router.push('/'), 1000);
    };

    return {
        initFromSession,
        randomAction,
        initOptions,
        battleStart,
        getDefaultPerson,
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
        gameReset,
        gameInit,
        gameResult,
        updateSkills,

        logout,
        signUp,
        loginRequest
    }
}
export default useMonsterSlayerService;