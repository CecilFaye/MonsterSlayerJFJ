/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionTree, useStore } from 'vuex';
import useMonsterSlayerRequest from '@/services/monster-slayer-request';
import { IAccount, InfoKeyValue, IRootState, ISkills } from '../../types';
import { MutationTypes } from './mutations';
import { IGameState } from './state';

const request = useMonsterSlayerRequest();

export enum ActionTypes {
    loadCharacterAsync = 'LOAD_CHARACTER_ASYNC',
    loadEnemyAsync = 'LOAD_ENEMY_ASYNC',
    loadDungeonAsync = 'LOAD_DUNGEON_ASYNC',
    enterDungeonAsync = 'ENTER_DUNGEON_ASYNC',
    updateSkillAsync = 'UPDATE_SKILL_ASYNC',
}

export enum CharacterInfo {
    character = 'character',
    inventory = 'inventory',
    skills = 'skills',
    dungeon = 'dungeon'
}

// type AugmentedActionContext = Omit<ActionContext<IGameState, IGameState>, 'commit'> & {
//     commit<K extends keyof GameMutations>(
//       key: K,
//       payload: Parameters<GameMutations[K]>[1]
//     ): ReturnType<GameMutations[K]>;
// }

export interface GameActions {
    [ActionTypes.loadCharacterAsync]({ commit }, payload?: IAccount): Promise<boolean>;
    // [ActionTypes.loadEnemyAsync]({ commit }: AugmentedActionContext, payload: IAccount): Promise<void>;
    // [ActionTypes.loadDungeonAsync]({ commit }: AugmentedActionContext, payload: IAccount): Promise<void>;
    // [ActionTypes.enterDungeonAsync]({ commit }: AugmentedActionContext, payload: IAccount): Promise<void>;
    [ActionTypes.updateSkillAsync]({ commit }, payload: ISkills): Promise<any>;
}

export const actions: ActionTree<IGameState, IRootState> & GameActions= {
    [ActionTypes.loadCharacterAsync]: ({ commit }, payload?: IAccount): Promise<boolean> => {
        const accountId = payload.accountId;
        const promiseMap: InfoKeyValue[] = [
            { key: 'inventory' , value: request.getInventory },
            { key: 'skills' , value: request.getSkills },
            { key: 'dungeon' , value: request.getDungeons }
        ];
        if (accountId)
        return request.getCharacter(accountId)
        .then(charInfo => {
            commit(MutationTypes.setCharacter, charInfo);
            return Promise.all(
                promiseMap.map(async info => {
                    return {
                        key: info.key,
                        [info.key]: await info.value(charInfo._id)
                    } as InfoKeyValue;
                })
            )
        })
        .then(val => {
            commit(MutationTypes.setSkills, val.find(_ => _.key === CharacterInfo.skills)[CharacterInfo.skills]);
            commit(MutationTypes.setInventory, val.find(_ => _.key === CharacterInfo.inventory)[CharacterInfo.inventory]);
            commit(MutationTypes.setDungeons, val.find(_ => _.key === CharacterInfo.dungeon)[CharacterInfo.dungeon]);
            return true;
        }).catch(err => {
            console.log(err);
            return false;
        });
        else return new Promise<boolean>(() => false);
    },
    [ActionTypes.updateSkillAsync]: ({ commit }, payload: any): Promise<any> => {
        return request.putSkills(payload.characterId, payload.skills);
    }
    // [ActionTypes.loadEnemyAsync]: ({ commit }, payload: any): Promise<void> => {

    // },
    // [ActionTypes.loadDungeonAsync]: ({ commit }, payload: any): Promise<void> => {

    // },
    // [ActionTypes.enterDungeonAsync]: ({ commit }, payload: any): Promise<void> => {

    // }
}
