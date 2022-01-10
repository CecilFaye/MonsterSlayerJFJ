/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetterTree } from 'vuex';
import { IDungeonResponse, IInventory, IPersonState, IRootState, ISkills, PersonType } from '@/store/types';
import { IGameState } from './state';

export enum GetterTypes {
    getState = 'GET_STATE',
    getScreen = 'GET_SCREEN',
    getSkills = 'GET_SKILLS',
    getInventory = 'GET_INVENTORY',
    getDungeons = 'GET_DUNGEONS',
    getCharacterSkills = 'GET_CHAR_SKILLS',
    isWinner = 'IS_WINNER',
    getPlayerState = 'GET_PLAYER',
    getEnemyState = 'GET_ENEMY'
}

export interface GameGetters {
    [GetterTypes.getState](state: IGameState):  (name: string) => any;
    [GetterTypes.getScreen](state: IGameState): string;
    [GetterTypes.getCharacterSkills](state: IGameState): (type: PersonType) => ISkills[];
    [GetterTypes.getDungeons](state: IGameState, commit: any): () => IDungeonResponse[];
    [GetterTypes.getSkills](state: IGameState): () => ISkills[];
    [GetterTypes.getInventory](state: IGameState): () => IInventory[];
    [GetterTypes.isWinner](state: IGameState): boolean;
    [GetterTypes.getPlayerState](state: IGameState): () => IPersonState;
    [GetterTypes.getEnemyState](state: IGameState): () => IPersonState;
}

export const getters: GetterTree<IGameState, IRootState> & GameGetters = {
    [GetterTypes.getState]: (state) => (name: string): any => {
        return state[name];
    },
    [GetterTypes.getScreen]: (state): string => {
        return state.currentScreen;
    },
    [GetterTypes.getDungeons]: (state) => (): IDungeonResponse[] => {
       return state.dungeon;
    },
    [GetterTypes.getSkills]: (state) => (): ISkills[] => {
        return state.skills;
    },
    [GetterTypes.getInventory]: (state) => (): IInventory[] => {
        return state.inventory;
    },
    [GetterTypes.getPlayerState]: (state) => (): IPersonState => {
        return state.player;
    },
    [GetterTypes.getEnemyState]: (state) => (): IPersonState => {
        return state.monster;
    },
    [GetterTypes.isWinner]: (state): boolean => {
        return state.player.currentState.health < 1 ? false : true;
    },
    [GetterTypes.getCharacterSkills]: (state) => (type: PersonType): ISkills[] => {
        return state[type]._raw.skills;
    }
}
