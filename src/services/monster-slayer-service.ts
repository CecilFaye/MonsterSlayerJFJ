

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
import { IAccount, ActivityStateOptions, ICharacter, IPersonState, PersonType, IAccountResponse, CharacterTypes, ISkills, IEquipment, IItem } from "@/store/types";
import Monsters from '@/app-lib/json/monsters.json'
import Player from '@/app-lib/json/player.json';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ActionTypes } from "@/store/modules/actions";
import useMonsterSlayerRequest from "./monster-slayer-request";

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
    getCharacterEquipment: () => IItem[];
    getWinner: () => boolean;
    gameReset: () => void;
    gameInit: () => void;
    gameResult: () => void;
    battleStart: () => boolean;

    // Http Call
    signUp: (account: IAccount) => Promise<IAccountResponse | null>;
    loginRequest: (username: string, password: string) => Promise<IAccountResponse>;
}

export const useMonsterSlayerService = (): IMonsterSlayerService => {
    const request = useMonsterSlayerRequest();
    const store = useStore();
    const router = useRouter();
    const initFromSession = (): void => {
        store.commit('game/initFromSession');
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
                store.commit('game/setAccount', account);
            }
            return result;
        })
        .then(account => store.dispatch(ActionTypes.loadCharacterAsync, account)
            .then(() => account)
        );
    };
    const gameInit = (): void => {
        store.commit('game/initFirstTurn');
    };
    const battleStart = (): boolean => store.state.game.battleStart;
    const getCharacterDetails = (): ICharacter => {
        const character = store.getters['game/getState']('character');
        return character;
    };
    const getCharacterSkills = (): ISkills[] => {
        const character: ICharacter = store.getters['game/getState']('character');
        return character.skills;
    };
    const getCharacterEquipment = (): IItem[] => {
        const character: ICharacter = store.getters['game/getState']('character');
        return Object.keys(character.equipment).map(key => character.equipment[key]);
    };
    const getWinner = ():boolean => {
        return store.getters['game/isWinner']();
    };
    const gameReset = (): void => store.commit('game/reset', getDefaultPerson);
    const gameResult = (): void => {
        router.push('/game/fightresult');
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
        getWinner,
        gameReset,
        gameInit,
        gameResult,

        // Http Call
        signUp,
        loginRequest
    }
}
export default useMonsterSlayerService;