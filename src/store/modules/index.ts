import { Module } from 'vuex'
import { mutations } from './mutations'
import { IState } from './state'
import { RootState, ActivityStateOptions, ScreenStateOptions } from '@/store/types'

export const state: IState = {
    screenOptions: Object.keys(ScreenStateOptions).map(_ => _),
	currentScreen: 'homeScreen',

	// Player State
	player: {
        health: 0,
        maxHealth: 0,
        currentState: {
            activityState: 'idle',
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _),

            // TBD: Just in case
            // statusEffectState: '',
            // statusEffectStateOptions: ['normal', 'stun', 'poison']
        }
    },

    // Monster State
    monster: {
        health: 0,
        maxHealth: 0,
        currentState: {
            activityState: 'idle',
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _),
        }
    }
}
const namespaced = true
export const game: Module<IState, RootState> = {
    namespaced,
    state,
    mutations
}