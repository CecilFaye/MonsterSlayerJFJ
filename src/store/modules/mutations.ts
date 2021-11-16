import { MutationTree } from 'vuex'
import store from '..';
import * as helper from "@/app-lib/services/session-helper";
import { ActivityStateOptions, CharacterTypes, IAccount, IAction, ICharacter, ICharacterState, IPersonState, IState, PersonType, ScreenStateOptions } from '../types';

export const mutations: MutationTree<IState> = {
    setAccount(state, payload: IAccount) {
        helper.saveSession('account', payload);
        state.account = payload;
    },
    setCharacter(state, payload: ICharacter) {
        helper.saveSession('character', payload);
        state.character = payload;
    },
    changeScreen(state, payload: string) {
        state.currentScreen = payload;
    },
    initFromSession(state) {
        if (!state.account?.accountId) {
            store.commit('game/setAccount', helper.getSessionValue(helper.storageNames.account));
            store.commit('game/setCharacter', helper.getSessionValue(helper.storageNames.character));
        }
    },
    initializePlayer(state, payload: IPersonState) {
        // Still in use and initially from the json file
        state.player = payload;
        state.characterState =  JSON.parse(JSON.stringify(state.character)) as ICharacterState;

        // TEMPORARY: Use the same model until the monster API is available
        const character = state.characterState;
        state.player.name = character.name;
        // NOTE: Change the value to 1000 coz the value from API too low
        state.player.maxHealth = 700; //character.stats.health;
        state.player.maxMana = 700; //character.stats.mana;
        state.player.currentState.health = (state.player.maxHealth/state.player.maxHealth)*100;
        state.player.currentState.mana = (character.stats.mana/character.stats.mana)*100;
        state.player.skills.forEach((val, index) => {
            val.id = +character.skills[index]._id;
            val.name = character.skills[index].name;
            val.manaCost = character.skills[index].cost;
            if (character.skills[index].target === 'enemy') {
                val.damage = character.skills[index].damage;
                val.healthIncrement = 0;
            } else {
                val.damage = 0;
                val.healthIncrement -= character.skills[index].damage;
            }
        });
    },
    initializeMonster(state, payload: IPersonState) {
        // Still in use and from the json file
        state.monster = payload;

        // TEMPORARY: Use player as enemy data for now - not in use
        state.enemyState = JSON.parse(JSON.stringify(state.character)) as ICharacterState;

        // TEMPORARY: Use the same model until the monster API is available
        const character = state.enemyState;
        // NOTE: Change the health to 1000 coz the value from API too low
        state.monster.maxHealth = 1000; //character.stats.health;
        state.monster.maxMana = 1000; //haracter.stats.mana;
        state.monster.currentState.health = (state.monster.maxHealth/state.monster.maxHealth)*100;
        state.monster.currentState.mana = (character.stats.mana/character.stats.mana)*100;
        state.monster.skills.forEach((val, index) => {
            val.name = character.skills[index].name;
            val.manaCost = character.skills[index].cost;
            if (character.skills[index].target === 'enemy') {
                val.damage = character.skills[index].damage;
                val.healthIncrement = 0;
            } else {
                val.damage = 0;
                val.healthIncrement -= character.skills[index].damage;
            }
        });
    },
    initFirstTurn(state) {
        state.player.turn = true;
        state.battleStart = true;
    },
    reset(state, service) {

        // TODO: Change this code once the monster API is available
        state.fightLogs = [];
        state.player.turn = false;
        state.battleStart = false;
        store.commit('game/initializePlayer', service.getDefaultPerson(PersonType.Player));
        store.commit('game/initializeMonster', service.getDefaultPerson(PersonType.Monsters));
        alert(`Character is Loaded:  ${JSON.stringify(state.character)}`);

    },
    action(state, act: IAction) {
        const actor = act.personType as PersonType;
        const receiver = actor === PersonType.Player ? PersonType.Monsters : PersonType.Player;
        const manaCost = act.actionTaken.manaCost;
        const actorHealth = state[actor].currentState.health;
        const actorMana = state[actor].currentState.mana;
        const actorMaxHealth = state[actor].maxHealth;
        const actorMaxMana = state[actor].maxMana;
        const receiverHealth = state[receiver].currentState.health;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const receiverMana = state[receiver].currentState.mana;
        const receiverMaxHealth = state[receiver].maxHealth;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const receiverMaxMana = state[receiver].maxMana;
        const manaIncrement = act.actionTaken.manaIncrement;
        const healthIncrement = act.actionTaken.healthIncrement;

        if (actorMana > manaCost) {
            const actorActualMana = (actorMana/100)*actorMaxMana;
            const actorActualHealth = (actorHealth/100)*actorMaxHealth;
            const receiverActualHealth = (receiverHealth/100)*receiverMaxHealth;
            const remainingReceiverHealth = receiverActualHealth - act.actionTaken.damage;
            const remainingActorMana = actorActualMana - act.actionTaken.manaCost;
            const remainingHealthPercentage = (remainingReceiverHealth/receiverMaxHealth)*100;
            const remainingActorManaPercentage = (remainingActorMana/actorMaxMana)*100;
            state[actor].currentState.activityState = act.actionTaken.skillType;
            state[receiver].currentState.health = remainingHealthPercentage < 0 ? 0 : remainingHealthPercentage;
            state[actor].currentState.mana = remainingActorManaPercentage < 0 ? 0 : remainingActorManaPercentage;

            if (healthIncrement) {
                const healthTotal = actorActualHealth + act.actionTaken.healthIncrement;
                const healthTotalPercentage = (healthTotal/actorMaxHealth)*100;
                state[actor].currentState.health =  healthTotalPercentage > 100 ? 100 : healthTotalPercentage;
            }
            if (manaIncrement) {
                const manaTotal = actorActualMana + act.actionTaken.manaIncrement;
                const manaTotalPercentage = (manaTotal/actorMaxMana)*100;
                state[actor].currentState.mana = manaTotalPercentage > 100 ? 100 : manaTotalPercentage;
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
        } else {
            const attackerName = (act.personType === PersonType.Player ? state.player.name : state.monster.name).toUpperCase();
            const skillName = act.actionTaken.name.toUpperCase();
            state.fightLogs.unshift(attackerName +" failed to use " + skillName +  ". Not enough mana!");
            state[actor].turn = false;
            state[receiver].turn = true;
        }
    },
    actionLog(state, act: IAction) {
        const attackerName = (act.personType === PersonType.Player ? state.player.name : state.monster.name).toUpperCase();
        const skillName = act.actionTaken.name.toUpperCase();

        if(act.actionTaken.damage != 0 && act.actionTaken.healthIncrement != 0)//Avada kedavra
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " dealt " + act.actionTaken.damage +" damage and gained " + act.actionTaken.healthIncrement + " health");
        }
        else if(act.actionTaken.damage == 0  && act.actionTaken.manaIncrement != 0) //Focus
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " gained " + act.actionTaken.manaIncrement +" mana");
        }
        else if(act.actionTaken.damage == 0 && act.actionTaken.healthIncrement != 0) //Anapneo
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " gained " + act.actionTaken.healthIncrement +" health");
        }
        else //Attack, Aqua Eructo
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " dealt " + act.actionTaken.damage +" damage");
        }
    }
}
