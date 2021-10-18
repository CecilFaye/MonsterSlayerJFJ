import { MutationTree } from 'vuex'
import { IState } from './state'

export const mutations: MutationTree<IState> = {
    changeScreen(state, view) {
        return state.currentScreen = view;
    },
    initializeMonster(state, monster) {
        state.monster = monster;
    }
}