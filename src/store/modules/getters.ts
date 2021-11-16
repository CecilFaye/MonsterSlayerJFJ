import { GetterTree } from 'vuex'
import { ActivityStateOptions, IRootState, ISkill, IState, PersonType } from '../types';

export const getters: GetterTree<IState, IRootState> = {
    getState: (state) => (name: string): any => {
        return state[name];
    },
    getScreen: (state) => {
        return state.currentScreen;
    },
    getSkills: (state) => (type: PersonType): ISkill[] => {
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
    isWinner: (state) => (): boolean => {
        return state.player.currentState.health < 1 ? false : true;
    }
}
