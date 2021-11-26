/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetterTree } from 'vuex';
import { ActivityStateOptions, IRootState, ISkill, PersonType } from '@/store/types';
import { IGameState } from './state';
// import { IAppState } from '@/store';

export enum GetterTypes {
    getState = 'GET_STATE',
    getScreen = 'GET_SCREEN',
    getSkills = 'GET_SKILLS',
    isWinner = 'IS_WINNER',
}

export interface GameGetters {
    [GetterTypes.getState](state: IGameState):  (name: string) => any;
    [GetterTypes.getScreen](state: IGameState): string;
    [GetterTypes.getSkills](state: IGameState): (type: PersonType) => ISkill[];
    [GetterTypes.isWinner](state: IGameState): boolean;
}

export const getters: GetterTree<IGameState, IRootState> & GameGetters = {
    [GetterTypes.getState]: (state) => (name: string): any => {
        return state[name];
    },
    [GetterTypes.getScreen]: (state): string => {
        return state.currentScreen;
    },
    [GetterTypes.getSkills]: (state) => (type: PersonType): ISkill[] => {
        switch(type) {
            case PersonType.Player: {
                const player = state.player;
                const idleState = {
                    name: 'idle',
                    skillType: ActivityStateOptions.Idle,
                    image: player.image,
                } as ISkill;
                return [idleState, player.attack, player.focus, ...state.player.skills];
            }
            case PersonType.Monsters: {
                const monster = state.monster;
                const idleState = {
                    name: 'idle',
                    skillType: ActivityStateOptions.Idle,
                    image: monster.image,
                } as ISkill;
                return [ idleState, monster.attack, monster.focus, ...state.monster.skills];
            }
        }
    },
    [GetterTypes.isWinner]: (state): boolean => {
        return state.player.currentState.health < 1 ? false : true;
    }
}
