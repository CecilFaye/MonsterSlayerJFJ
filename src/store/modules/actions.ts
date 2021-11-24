import useMonsterSlayerRequest from '@/services/monster-slayer-request';
import { ActionTree } from 'vuex'
import { IAccount, IRootState, IState, } from '../types';

const request = useMonsterSlayerRequest();

export enum ActionTypes {
    loadCharacterAsync = 'LOAD_CHARACTER_ASYNC',
    loadEnemyAsync = 'LOAD_ENEMY_ASYNC',
    loadDungeonAsync = 'LOAD_DUNGEON_ASYNC',
    enterDungeonAsync = 'ENTER_DUNGEON_ASYNC',
}

export const actions: ActionTree<IState, IRootState> = {
    [ActionTypes.loadCharacterAsync]: ({ commit }, payload: IAccount) => {
        return request.getCharacter(payload).then(character => {
            commit('game/setCharacter', character);
            return character;
        });
    },
    // [ActionTypes.loadEnemyAsync]: ({ commit, state }, payload: any) => {

    // },
    // [ActionTypes.loadDungeonAsync]: ({ commit, state }, payload: any) => {

    // },
    // [ActionTypes.enterDungeonAsync]: ({ commit, state }, payload: any) => {

    // }
}
