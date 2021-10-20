import { ActivityStateOptions, IPersonState, IRootState, ISkill, IState, PersonType } from '@/store/types';
import { Store } from 'vuex';
import Monsters from '../services/monsters.json';
import Player from '../services/player.json';

export default {
    randomAction(): number  {
        return Math.floor(Math.random() * 3);
    },
    getDefaultPerson(type: PersonType): IPersonState {
        let personState: IPersonState;
        switch(type) {
            case PersonType.Player:
                personState = Player as IPersonState;
                break;
            case PersonType.Monsters:
                personState = this.getRandomMonsters()
                break;
        }
        return this.initOptions(personState);
    },
    getRandomMonsters(): IPersonState {
        const monsters = Monsters as IPersonState[];
        return monsters[this.randomAction()];
    },
    initOptions(person: IPersonState): IPersonState {
        person.currentState = {
            health: person.maxHealth,
            mana: person.maxMana,
            activityState: ActivityStateOptions.Idle,
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _) as ActivityStateOptions[]
        };
        return person;
    },
    action(store: Store<any>, personType: PersonType, skill: ISkill): void {
        const state = store.state;
        const playerHealth = state.player.currentState.health;
        const monsterHealth = state.monster.currentState.health;
        const playerMana = state.player.currentState.mana;
        const monsterMana = state.monster.currentState.mana;
        if (personType === PersonType.Player) {
            state.monster.currentState.health = monsterHealth - skill.damage;
            state.player.currentState.mana = playerMana - skill.manaCost;
            state.player.currentState.health = playerHealth + skill.healthIncrement;
        } else {
            state.player.currentState.health = playerHealth - skill.damage;
            state.monster.currentState.mana = monsterMana - skill.manaCost;
            state.monster.currentState.health = monsterHealth + skill.healthIncrement;
        }
        store.commit('game/')
    }
}