import { MutationTree, useStore } from 'vuex';

import * as helper from '@/app-lib/helper/session-helper';
import {
	ActivityStateOptions, IAccount, IAction, ICharacter, ICharacterState, IDungeonResponse,
	IInventory, IPersonState, ISkills, PersonType
} from '@/store/types';

import { IGameState } from './state';
import { storageNames } from '@/app-lib/helper/session-helper';

export enum MutationTypes {
    setAccount = 'SET_ACCOUNT',
    setCharacter = 'SET_CHARACTER',
    setSkills = 'SET_SKILLS',
    setInventory = 'SET_INVENTORY',
    setDungeons = 'SET_DUNGEONS',
    initializePlayer = 'INIT_CHARACTER',
    initializeMonster = 'INIT_ENEMY',
    initFirstTurn= 'INIT_FIRST_TURN',
    reset = 'RESET_GAME',
    action = 'ACT_ACTOR',
    actionLog = 'LOG_EVENT',
    changeScreen = 'CHANGE_SCREEN'
}

export interface GameMutations {
    [MutationTypes.setAccount](state: IGameState, payload: IAccount): void;
    [MutationTypes.setCharacter](state: IGameState, payload: ICharacter): void;
    [MutationTypes.setSkills](state: IGameState, payload: ISkills[]): void;
    [MutationTypes.setInventory](state: IGameState, payload: IInventory[]): void;
    [MutationTypes.setDungeons](state: IGameState, payload: IDungeonResponse[]): void;
    [MutationTypes.initializePlayer](state: IGameState, payload: IPersonState): void;
    [MutationTypes.initializeMonster](state: IGameState, payload: IPersonState): void;
    [MutationTypes.initFirstTurn](state: IGameState): void;
    [MutationTypes.reset](state: IGameState, getDefaultPerson: (type: PersonType) => IPersonState): void;
    [MutationTypes.action](state: IGameState, payload: { work: IAction, reset: () => void }): void;
    [MutationTypes.actionLog](state: IGameState, payload: IAction): void;
    [MutationTypes.changeScreen](state: IGameState, payload: string): void;
}
const store = useStore();

export const mutations: MutationTree<IGameState> = {
    [MutationTypes.changeScreen](state, payload: string) {
        state.currentScreen = payload;
    },
    [MutationTypes.setAccount](state, payload: IAccount) {
        helper.saveSession(storageNames.account, payload);
        state.account = payload;
    },
    [MutationTypes.setCharacter](state, payload: ICharacter) {
        helper.saveSession(storageNames.character, payload);
        state.character = payload;
    },
    [MutationTypes.setSkills](state, payload: ISkills[]) {
        helper.saveSession(storageNames.skills, payload);
        state.skills = payload;
    },
    [MutationTypes.setInventory](state, payload: IInventory[]) {
        helper.saveSession(storageNames.inventory, payload);
        state.inventory = payload;
    },
    [MutationTypes.setDungeons](state, payload: IDungeonResponse[]) {
        helper.saveSession(storageNames.dungeons, payload);
        state.dungeon = payload;
    },
    [MutationTypes.initializePlayer](state, payload: IPersonState) {
        // Still in use and initially from the json file
        state.player = payload;
        state.characterState =  JSON.parse(JSON.stringify(state.character)) as ICharacterState;

        // TEMPORARY: Use the same model until the monster API is available
        const character = state.characterState;
        state.player.name = character.name;
        // NOTE: Change the value to 500 coz the value from API is too low
        state.player.maxHealth = 500; //character.stats.health;
        state.player.maxMana = 200; //character.stats.mana;
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
    [MutationTypes.initializeMonster](state, payload: IPersonState) {
        // Still in use and from the json file
        state.monster = payload;

        // TEMPORARY: Use player as enemy data for now - not in use
        state.enemyState = JSON.parse(JSON.stringify(state.character)) as ICharacterState;

        // TEMPORARY: Use the same model until the monster API is available
        const character = state.enemyState;
        // NOTE: Change the health to 1000 coz the value from API is too low
        state.monster.maxHealth = 1000; //character.stats.health;
        state.monster.maxMana = 500; //haracter.stats.mana;
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
    [MutationTypes.initFirstTurn](state) {
        state.player.turn = true;
        state.battleStart = true;
    },
    [MutationTypes.reset](state, getDefaultPerson: (type: PersonType) => IPersonState) {

        // TODO: Change this code once the monster API is available
        state.fightLogs = [];
        state.player.turn = false;
        state.battleStart = false;
        store.commit(MutationTypes.initializePlayer, getDefaultPerson(PersonType.Player));
        store.commit(MutationTypes.initializeMonster, getDefaultPerson(PersonType.Monsters));

    },
    [MutationTypes.action](state, payload: { work: IAction, reset: () => void }) {
        const act = payload.work;
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
        const actorActualMana = (actorMana/100)*actorMaxMana;
        const actorActualHealth = (actorHealth/100)*actorMaxHealth;
        const receiverActualHealth = (receiverHealth/100)*receiverMaxHealth;

        if (actorActualMana > manaCost) {
            const remainingReceiverHealth = receiverActualHealth - act.actionTaken.damage;
            const remainingActorMana = actorActualMana - act.actionTaken.manaCost;
            const remainingHealthPercentage = (remainingReceiverHealth/receiverMaxHealth)*100;
            const remainingActorManaPercentage = (remainingActorMana/actorMaxMana)*100;
            state[actor].currentState.activityState = act.actionTaken.skillType;
            state[receiver].currentState.health = remainingHealthPercentage <= 0 ? 0 : remainingHealthPercentage;
            state[actor].currentState.mana = remainingActorManaPercentage <= 0 ? 0 : remainingActorManaPercentage;

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
            store.commit(MutationTypes.actionLog, act);
            setTimeout(() =>{
                if (state[receiver].currentState.health < 1) {
                    payload.reset();
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
    [MutationTypes.actionLog](state, payload: IAction) {
        const attackerName = (payload.personType === PersonType.Player ? state.player.name : state.monster.name).toUpperCase();
        const skillName = payload.actionTaken.name.toUpperCase();

        if(payload.actionTaken.damage != 0 && payload.actionTaken.healthIncrement != 0)//Avada kedavra
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " dealt " + payload.actionTaken.damage +" damage and gained " + payload.actionTaken.healthIncrement + " health");
        }
        else if(payload.actionTaken.damage == 0  && payload.actionTaken.manaIncrement != 0) //Focus
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " gained " + payload.actionTaken.manaIncrement +" mana");
        }
        else if(payload.actionTaken.damage == 0 && payload.actionTaken.healthIncrement != 0) //Anapneo
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " gained " + payload.actionTaken.healthIncrement +" health");
        }
        else //Attack, Aqua Eructo
        {
            state.fightLogs.unshift(attackerName +" used " + skillName +  " dealt " + payload.actionTaken.damage +" damage");
        }
    }
}

