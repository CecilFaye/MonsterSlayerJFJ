import { ActivityStateOptions, IPersonState, PersonType } from '@/store/types';
import Monsters from '../services/monsters.json';
import Player from '../services/player.json';

export default {
    randomAction(limit: number): number  {
        return Math.floor(Math.random() * limit);
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
        return monsters[this.randomAction(Monsters.length-1)];
    },
    initOptions(person: IPersonState): IPersonState {
        person.currentState = {
            health: person.maxHealth,
            mana: person.maxMana,
            activityState: ActivityStateOptions.Idle,
            activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _) as ActivityStateOptions[]
        };
        return person;
    }
}