import { MutationTree } from 'vuex'
import { ActivityStateOptions, IAction, IPersonState, ISkill, IState, PersonType } from '../types';

export const mutations: MutationTree<IState> = {
    changeScreen(state, payload: string) {
        state.currentScreen = payload;
    },
    initializePlayer(state, payload: IPersonState) {
        state.player = payload;
        console.log(state.player);
    },
    initializeMonster(state, payload: IPersonState) {
        state.monster = payload;
        console.log(state.monster);
    },
    action(state, act: IAction) {
        const playerHealth = state.player.currentState.health;
        const monsterHealth = state.monster.currentState.health;
        const playerMana = state.player.currentState.mana;
        const monsterMana = state.monster.currentState.mana;
        if (act.personType === PersonType.Player) {
            state.player.currentState.activityState = act.actionTaken.skillType;
            state.monster.currentState.health = monsterHealth - act.actionTaken.damage;
            state.player.currentState.mana = playerMana - act.actionTaken.manaCost;
            state.player.currentState.health = playerHealth + act.actionTaken.healthIncrement;
            setTimeout(() =>{
                state.player.currentState.activityState = ActivityStateOptions.Idle;
            }, act.actionTaken.timeout);
        } else {
            state.monster.currentState.activityState = act.actionTaken.skillType;
            state.player.currentState.health = playerHealth - act.actionTaken.damage;
            state.monster.currentState.mana = monsterMana - act.actionTaken.manaCost;
            state.monster.currentState.health = monsterHealth + act.actionTaken.healthIncrement;
            setTimeout(() =>{
                state.monster.currentState.activityState = ActivityStateOptions.Idle;
            }, act.actionTaken.timeout);
        }
    }
}