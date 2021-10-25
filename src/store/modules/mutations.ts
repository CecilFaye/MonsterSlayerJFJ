import { MutationTree } from 'vuex'
import { ActivityStateOptions, IAction, IPersonState, ISkill, IState, PersonType } from '../types';

export const mutations: MutationTree<IState> = {
    changeScreen(state, payload: string) {
        state.currentScreen = payload;
    },
    initializePlayer(state, payload: IPersonState) {
        state.player = payload;
    },
    initializeMonster(state, payload: IPersonState) {
        state.monster = payload;
    },
    initFirstTurn(state) {
        state.player.turn = true;
        state.battleStart = true;
    },
    action(state, act: IAction) {
        const actor = act.personType as PersonType;
        const receiver = actor === PersonType.Player ? PersonType.Monsters : PersonType.Player;

        const manaCost = act.actionTaken.manaCost;

        const actorHealth = state[actor].currentState.health;
        const actorMana = state[actor].currentState.mana;
        const receiverHealth = state[receiver].currentState.health;
        const receiverMana = state[receiver].currentState.mana;

        const manaIncrement = act.actionTaken.manaIncrement;
        const healthIncrement = act.actionTaken.healthIncrement;
        if (actorMana > manaCost) {
            state[actor].currentState.activityState = act.actionTaken.skillType;
            state[receiver].currentState.health = receiverHealth - act.actionTaken.damage;
            state[actor].currentState.mana = actorMana - act.actionTaken.manaCost;

            if (healthIncrement) {
                const healthTotal = actorHealth + act.actionTaken.healthIncrement;
                state[actor].currentState.health =  healthTotal > 100 ? 100 : healthTotal;
            }
            if (manaIncrement) {
                const manaTotal = actorMana + act.actionTaken.manaIncrement;
                state[actor].currentState.mana = manaTotal > 100 ? 100 : manaTotal;
            }
        } else {
            // Failed Attack - Do nothing for now OR disabled the Button if mana < mana cost
            //state[actor].currentState.activityState = ActivityStateOptions.Failed;
        }
        state.fightLogs.unshift(state[actor].name + " used " + act.actionTaken.name + (act.actionTaken.damage > 0 ? " and dealt " + act.actionTaken.damage + " damage" : ""));
        setTimeout(() =>{
            state[actor].currentState.activityState = ActivityStateOptions.Idle;
            state[actor].turn = false;
            state[receiver].turn = true;
        }, act.actionTaken.timeout);

    }
}