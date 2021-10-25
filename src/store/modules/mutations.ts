import { MutationTree } from 'vuex'
import store from '..';
import { ActivityStateOptions, IAction, IPersonState, IState, PersonType, ScreenStateOptions } from '../types';

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
    reset(state, service) {
        state.fightLogs = [];
        state.player.turn = false;
        state.battleStart = false;
        store.commit('game/initializePlayer', service.getDefaultPerson(PersonType.Player));
        store.commit('game/initializeMonster', service.getDefaultPerson(PersonType.Monsters));
    },
    action(state, act: IAction) {
        const actor = act.personType as PersonType;
        const receiver = actor === PersonType.Player ? PersonType.Monsters : PersonType.Player;
        const manaCost = act.actionTaken.manaCost;
        const actorHealth = state[actor].currentState.health;
        const actorMana = state[actor].currentState.mana;
        const receiverHealth = state[receiver].currentState.health;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const receiverMana = state[receiver].currentState.mana;

        const manaIncrement = act.actionTaken.manaIncrement;
        const healthIncrement = act.actionTaken.healthIncrement;
        if (actorMana > manaCost) {
            const remainingReceiverHealth = receiverHealth - act.actionTaken.damage;
            const remainingActorMana = actorMana - act.actionTaken.manaCost;
            state[actor].currentState.activityState = act.actionTaken.skillType;
            state[receiver].currentState.health = remainingReceiverHealth < 0 ? 0 : remainingReceiverHealth;
            state[actor].currentState.mana = remainingActorMana < 0 ? 0 : remainingActorMana;

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
        store.commit('game/actionLog', act);
        setTimeout(() =>{
            if (state[receiver].currentState.health < 1) {
                console.log(state[receiver]);
                console.log(state[actor]);
                store.commit('game/changeScreen', ScreenStateOptions.FightResultScreen);
            } else  {
                state[actor].currentState.activityState = ActivityStateOptions.Idle;
                state[actor].turn = false;
                state[receiver].turn = true;
            }
        }, act.actionTaken.timeout);

    },
    actionLog(state, act: IAction) {
        const attackerName = act.personType === PersonType.Player ? state.player.name : state.monster.name;
        if(act.actionTaken.damage != 0 && act.actionTaken.healthIncrement != 0)//Avada kedavra
        {
            state.fightLogs.unshift(attackerName +" used " + act.actionTaken.name +  " dealt " + act.actionTaken.damage +" damage and gained " + act.actionTaken.healthIncrement + " health");
        }
        else if(act.actionTaken.damage == 0  && act.actionTaken.manaIncrement != 0) //Focus
        {
            state.fightLogs.unshift(attackerName +" used " + act.actionTaken.name +  " gained " + act.actionTaken.manaIncrement +" mana");
        }
        else if(act.actionTaken.damage == 0 && act.actionTaken.healthIncrement != 0) //Anapneo
        {
            state.fightLogs.unshift(attackerName +" used " + act.actionTaken.name +  " gained " + act.actionTaken.healthIncrement +" health");
        }
        else //Attack, Aqua Eructo
        {
            state.fightLogs.unshift(attackerName +" used " + act.actionTaken.name +  " dealt " + act.actionTaken.damage +" damage");
        }
    }
}
