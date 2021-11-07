<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { ActivityStateOptions, IMonsterSlayerService, IPersonState, PersonType } from "@/store/types";
    import Monsters from '../services/monsters.json';
    import Player from '../services/player.json';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
	const heroIdleStance = require('../assets/hero/playerAqua-idle.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const heroAttackStance = require('../assets/hero/playerBeast-attack.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const heroFocusStance = require('../assets/hero/playerBeast-focus.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const heroSkillStance = require('../assets/hero/playerBeast-attack.gif');

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const monsterIdleStance = require('../assets/monster/monsterPlant-idle.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const monsterAttackStance = require('../assets/monster/monsterPlant-attack.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const monsterFocusStance = require('../assets/monster/monsterPlant-focus.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const monsterSkillStance = require('../assets/monster/monsterPlant-attack.gif');

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const playerActionImages = {
		[ActivityStateOptions.Idle]: heroIdleStance,
		[ActivityStateOptions.Attack]: heroAttackStance,
		[ActivityStateOptions.Focus]: heroFocusStance,
		[ActivityStateOptions.Skill1]: heroSkillStance,
		[ActivityStateOptions.Skill2]: heroFocusStance,
		[ActivityStateOptions.Skill3]: heroSkillStance,
        // Assign an image for failed attack
        [ActivityStateOptions.Failed]: heroIdleStance
	};

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const monsterActionImages = {
		[ActivityStateOptions.Idle]: monsterIdleStance,
		[ActivityStateOptions.Attack]: monsterAttackStance,
		[ActivityStateOptions.Focus]: monsterFocusStance,
		[ActivityStateOptions.Skill1]: monsterSkillStance,
		[ActivityStateOptions.Skill2]: monsterSkillStance,
		[ActivityStateOptions.Skill3]: monsterSkillStance,
        // Assign an image for failed attack
        [ActivityStateOptions.Failed]: monsterIdleStance
	};

    const useMonsterSlayerService = (): IMonsterSlayerService => {
        const randomAction = (limit: number): number => {
            return Math.floor(Math.random() * limit);
        };
        const getDefaultPerson = (type: PersonType): IPersonState => {
            let personState: IPersonState;
            switch(type) {
                case PersonType.Player:
                    personState = Player as IPersonState;
                    personState.turn = true;
                    break;
                case PersonType.Monsters:
                    personState = getRandomMonsters();
                    personState.turn = false;
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
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getCharacterImage = (personType: PersonType, type: ActivityStateOptions): any => {
            return personType === PersonType.Player ? playerActionImages[type] : monsterActionImages[type];
        };
        return {
            randomAction,
            initOptions,
            getDefaultPerson,
            getRandomMonsters,
            getCharacterImage
        }
    }
    export default useMonsterSlayerService;
</script>