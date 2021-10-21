<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { ActivityStateOptions, IMonsterSlayerService, IPersonState, PersonType } from "@/store/types";
    import Monsters from '../services/monsters.json';
    import Player from '../services/player.json';

    const useMonsterSlayerService = (): IMonsterSlayerService => {
        const randomAction = (limit: number): number => {
            return Math.floor(Math.random() * limit);
        };
        const getDefaultPerson = (type: PersonType): IPersonState => {
            let personState: IPersonState;
            switch(type) {
                case PersonType.Player:
                    personState = Player as IPersonState;
                    break;
                case PersonType.Monsters:
                    personState = getRandomMonsters()
                    break;
            }
            return initOptions(personState);
        };
        const getRandomMonsters = (): IPersonState => {
            const monsters = Monsters as IPersonState[];
            return monsters[randomAction(Monsters.length-1)];
        };
        const initOptions = (person: IPersonState): IPersonState => {
            person.currentState = {
                health: person.maxHealth,
                mana: person.maxMana,
                activityState: ActivityStateOptions.Idle,
                activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _) as ActivityStateOptions[]
            };
            return person;
        }
        return {
            randomAction,
            getDefaultPerson,
            getRandomMonsters,
            initOptions
        }
    }
    export default useMonsterSlayerService;
</script>