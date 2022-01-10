import { MutationTree, useStore } from 'vuex';

import * as helper from '@/app-lib/helper/session-helper';
import {
	ActivityStateOptions, IAccount, IAction, ICharacter, ICharacterState, IDungeonResponse,
	IInventory, IPersonState, ISkills, PersonType
} from '@/store/types';

import { IGameState } from './state';
import { storageNames } from '@/app-lib/helper/session-helper';
import { ActionResult } from '@/services/battle-engine';

export enum MutationTypes {
    setAccount = 'SET_ACCOUNT',
    setCharacter = 'SET_CHARACTER',
    setSkills = 'SET_SKILLS',
    setInventory = 'SET_INVENTORY',
    setDungeons = 'SET_DUNGEONS',
    initializePlayer = 'INIT_CHARACTER',
    initializeMonster = 'INIT_ENEMY',
    initFirstTurn= 'INIT_FIRST_TURN',
    initTurn= 'INIT_TURN',
    reset = 'RESET_GAME',
    action = 'ACT_ACTOR',
    actionLog = 'LOG_EVENT',
    actionLogGeneric = 'GENERIC_LOG_EVENT',
    changeScreen = 'CHANGE_SCREEN',
    updatePersonState = 'UPDATE_PERSON',
    acting = 'START_ACTING',
    stopActing = 'STOP_ACTING'
}

export interface GameMutations {
    [MutationTypes.setAccount](state: IGameState, payload: IAccount): void;
    [MutationTypes.setCharacter](state: IGameState, payload: ICharacter): void;
    [MutationTypes.setSkills](state: IGameState, payload: ISkills[]): void;
    [MutationTypes.setInventory](state: IGameState, payload: IInventory[]): void;
    [MutationTypes.setDungeons](state: IGameState, payload: IDungeonResponse[]): void;
    [MutationTypes.initializePlayer](state: IGameState, payload: IPersonState): void;
    [MutationTypes.initializeMonster](state: IGameState, payload: IPersonState): void;
    [MutationTypes.initFirstTurn](state: IGameState): void;
    [MutationTypes.initTurn](state: IGameState, payload: PersonType): void;
    [MutationTypes.reset](state: IGameState): void;
    [MutationTypes.acting](state: IGameState): void;
    [MutationTypes.stopActing](state: IGameState, payload: PersonType): void;
    [MutationTypes.action](state: IGameState, payload: { work: IAction, reset: () => void }): void;
    [MutationTypes.actionLog](state: IGameState, payload: IAction): void;
    [MutationTypes.changeScreen](state: IGameState, payload: string): void;
}

const store = useStore();
export const mutations: MutationTree<IGameState> = {
    [MutationTypes.changeScreen](state, payload: string) {
        state.currentScreen = payload;
    },
    [MutationTypes.setAccount](state, payload: IAccount) {
        helper.saveSession(storageNames.account, payload);
        state.account = payload;
    },
    [MutationTypes.setCharacter](state, payload: ICharacter) {
        helper.saveSession(storageNames.character, payload);
        state.character = payload;
    },
    [MutationTypes.setSkills](state, payload: ISkills[]) {
        helper.saveSession(storageNames.skills, payload);
        state.skills = payload;
    },
    [MutationTypes.setInventory](state, payload: IInventory[]) {
        helper.saveSession(storageNames.inventory, payload);
        state.inventory = payload;
    },
    [MutationTypes.setDungeons](state, payload: IDungeonResponse[]) {
        helper.saveSession(storageNames.dungeons, payload);
        state.dungeon = payload;
    },
    [MutationTypes.initializePlayer](state, payload: IPersonState) {
        state.player = payload;
    },
    [MutationTypes.initializeMonster](state, payload: IPersonState) {
        state.monster = payload;
    },
    [MutationTypes.initFirstTurn](state) {
        state.player.turn = true;
        state.battleStart = true;
    },
    [MutationTypes.initTurn](state, payload: PersonType) {
        (state[payload] as IPersonState).turn = true;
    },
    [MutationTypes.reset](state) {
        state.fightLogs = [];
        state.player.turn = false;
        state.battleStart = false;
    },
    [MutationTypes.acting](state, payload: any) {
        const charType = payload.personType;
        const otherChar = charType === PersonType.Player ? PersonType.Monsters : PersonType.Player;
        const action = payload.actionTaken;
        (state[charType] as IPersonState).toSelf = action.skill.target === 'self';
        (state[charType] as IPersonState).attacking = true;
        (state[otherChar] as IPersonState).attacking = false;
    },
    [MutationTypes.stopActing](state, payload: PersonType) {
        (state[payload] as IPersonState).attacking = false;
        (state[payload] as IPersonState).turn = false;
    },
    [MutationTypes.updatePersonState](state, payload: any) {
        const charType = payload.charType;
        (state[charType] as IPersonState).currentState.health = payload.health < 1 ? 0 : payload.health;
        (state[charType] as IPersonState).currentState.mana = payload.mana < 1 ? 0 : payload.mana;
    },
    // [MutationTypes.action](state, payload: { work: IAction, reset: () => void }) {

    //     const act = payload.work;
    //     const actor = act.personType as PersonType;
    //     const receiver = actor === PersonType.Player ? PersonType.Monsters : PersonType.Player;
    //     const manaCost = act.actionTaken.manaCost;
    //     const actorHealth = state[actor].currentState.health;
    //     const actorMana = state[actor].currentState.mana;
    //     const actorMaxHealth = state[actor].maxHealth;
    //     const actorMaxMana = state[actor].maxMana;
    //     const receiverHealth = state[receiver].currentState.health;
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const receiverMana = state[receiver].currentState.mana;
    //     const receiverMaxHealth = state[receiver].maxHealth;
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const receiverMaxMana = state[receiver].maxMana;
    //     const manaIncrement = act.actionTaken.manaIncrement;
    //     const healthIncrement = act.actionTaken.healthIncrement;
    //     const actorActualMana = (actorMana/100)*actorMaxMana;
    //     const actorActualHealth = (actorHealth/100)*actorMaxHealth;
    //     const receiverActualHealth = (receiverHealth/100)*receiverMaxHealth;


    //     if (actorActualMana > manaCost) {
    //         const remainingReceiverHealth = receiverActualHealth - act.actionTaken.damage;
    //         const remainingActorMana = actorActualMana - act.actionTaken.manaCost;
    //         const remainingHealthPercentage = (remainingReceiverHealth/receiverMaxHealth)*100;
    //         const remainingActorManaPercentage = (remainingActorMana/actorMaxMana)*100;
    //         state[actor].currentState.activityState = act.actionTaken.skillType;
    //         state[receiver].currentState.health = remainingHealthPercentage <= 0 ? 0 : remainingHealthPercentage;
    //         state[actor].currentState.mana = remainingActorManaPercentage <= 0 ? 0 : remainingActorManaPercentage;

    //         if (healthIncrement || manaIncrement) {
    //             state[actor].toSelf = true;
    //         } else {
    //             state[actor].toSelf = false;
    //         }

    //         if (healthIncrement) {
    //             const healthTotal = actorActualHealth + act.actionTaken.healthIncrement;
    //             const healthTotalPercentage = (healthTotal/actorMaxHealth)*100;
    //             state[actor].currentState.health =  healthTotalPercentage > 100 ? 100 : healthTotalPercentage;
    //         }
    //         if (manaIncrement) {
    //             const manaTotal = actorActualMana + act.actionTaken.manaIncrement;
    //             const manaTotalPercentage = (manaTotal/actorMaxMana)*100;
    //             state[actor].currentState.mana = manaTotalPercentage > 100 ? 100 : manaTotalPercentage;
    //         }

    //         state[actor].attacking = true;

    //         store?.commit('game/' + MutationTypes.actionLog, act);
    //         setTimeout(() =>{
    //             if (state[receiver].currentState.health < 1) {
    //                 payload.reset();
    //             } else  {
    //                 state[actor].currentState.activityState = ActivityStateOptions.Idle;
    //                 state[actor].turn = false;
    //                 state[actor].attacking = false;
    //                 state[receiver].turn = true;
    //             }
    //         }, act.actionTaken.timeout);
    //     } else {
    //         const attackerName = (act.personType === PersonType.Player ? state.player.name : state.monster.name).toUpperCase();
    //         const skillName = act.actionTaken.name.toUpperCase();
    //         state.fightLogs.unshift(attackerName +" failed to use " + skillName +  ". Not enough mana!");
    //         state[actor].turn = false;
    //         state[receiver].turn = true;
    //     }
    // },
    [MutationTypes.actionLog](state, payload: IAction) {
        const attackerName = (payload.personType === PersonType.Player ? state.player.name : state.monster.name).toUpperCase();
        const skillName = payload.actionTaken.skill.name.toUpperCase();
        if (payload.actionTaken.result === ActionResult.miss) {
            state.fightLogs.unshift(attackerName +" failed to use " + skillName +  ". Attack missed!");
        } else {
            state.fightLogs.unshift(attackerName +" used " + skillName + (payload.actionTaken.isCritical ? '. Critical strike!' : '.'));
        }
    },
    [MutationTypes.actionLogGeneric](state, payload: string) {
        state.fightLogs.unshift(payload);
    }
}

