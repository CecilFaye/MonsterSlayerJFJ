import { Module } from 'vuex'
import { mutations } from './mutations'
import { IRootState as IRootState, ActivityStateOptions, ScreenStateOptions, IState, ISkill, IPersonState, PersonType, ICharacterState, ICharacter, IAccount, CharacterTypes } from '@/store/types'
import { getters } from './getters'
import { actions } from './actions'

export const state = {
    screenOptions: Object.keys(ScreenStateOptions).map(_ => _),
    characterTypes: Object.keys(CharacterTypes),
	currentScreen: 'homeScreen',
    fightLogs: [],
    battleStart: false,

    account: {} as IAccount,
    character: {} as ICharacter,
    characterState: {} as ICharacterState,
    // NOTE: This is to assume that there will only be 1 enemy at a given battle
    enemyState: {} as ICharacterState,

	// Player State
	player: {
        id: 1,
        name: '',
        personType: PersonType.Player,
        image: '',
        maxHealth: 999,
        maxMana: 999,
        attack: {},
        focus: {},
        skills: [] as ISkill[],
        turn: false,
        currentState: {
            health: 0,
            mana: 0,
            activityState: 'idle',
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _),

            // TBD: Just in case
            // statusEffectState: '',
            // statusEffectStateOptions: ['normal', 'stun', 'poison']
        }
    } as IPersonState,

    // Monster State
    monster: {
        id: 0,
        name: '',
        personType: PersonType.Monsters,
        image: '',
        maxHealth: 0,
        maxMana: 0,
        attack: {},
        focus: {},
        skills: [] as ISkill[],
        turn: false,
        currentState: {
            health: 0,
            mana: 0,
            activityState: 'idle',
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _),
        }
    } as IPersonState
} as IState
const namespaced = true
export const game: Module<IState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
}