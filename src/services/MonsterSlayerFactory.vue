

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any */
	/* eslint-disable @typescript-eslint/no-empty-function */
    /* eslint-disable @typescript-eslint/no-var-requires */
    import axios from "axios";
	import { IAccount, ActivityStateOptions, ICharacter, IMonsterSlayerService, IPersonState, PersonType, IAccountResponse, CharacterTypes, ISkills, IEquipment, IItem } from "@/store/types";
    import Monsters from '@/app-lib/json/monsters.json'
    import Player from '@/app-lib/json/player.json';
    import { useStore } from "vuex";
    import { useRouter } from "vue-router";

	const heroIdleStance = require('@/assets/hero/playerAqua-idle.gif');
	const heroAttackStance = require('@/assets/hero/playerBeast-attack.gif');
	const heroFocusStance = require('@/assets/hero/playerBeast-focus.gif');
	const heroSkillStance = require('@/assets/hero/playerBeast-attack.gif');

	const monsterIdleStance = require('@/assets/monster/monsterPlant-idle.gif');
	const monsterAttackStance = require('@/assets/monster/monsterPlant-attack.gif');
	const monsterFocusStance = require('@/assets/monster/monsterPlant-focus.gif');
	const monsterSkillStance = require('@/assets/monster/monsterPlant-attack.gif');

    const apiUrl = 'https://monster-slayer-api-staging.herokuapp.com';

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
        const store = useStore();
        const router = useRouter();
        const initFromSession = (): void => {
            store.commit('game/initFromSession');
        };
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
        const getCharacterTypeName = (characterTypeId: number): string => {
            let stringName = '';
            Object.keys(CharacterTypes).forEach(type => {
                if (CharacterTypes[type] === characterTypeId) {
                    stringName = type;
                }
            });
            return stringName;
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
        const getCharacterImage = (personType: PersonType, type: ActivityStateOptions): any => {
            return personType === PersonType.Player ? playerActionImages[type] : monsterActionImages[type];
        };

        const signUp = (account: IAccount): Promise<IAccountResponse | null> => {
            return axios.post(`${apiUrl}/accounts`, account)
                .then(result => result.data as IAccountResponse)
                .catch(err => {
                    console.log(err);
                    return err.response.data;
                });
        };

        const loginRequest = (username: string, password: string): Promise<IAccountResponse> => {
            return axios.post(`${apiUrl}/accounts/login`, {
                username,
                password
            })
            .then(result => {
                const account = result.data as IAccount;
                store.commit('game/setAccount', account);
                return account;
            })
            .then(account => {
                return axios.get(`${apiUrl}/accounts/${account.accountId}/character`)
                    .then(result => {
                        const character = result.data as ICharacter;
                        character.classTypeName = getCharacterTypeName(character.classType);
                        store.commit('game/setCharacter', character);
                        return account;
                    })
                    .catch(err => {
                        return err.response.data;
                    });
            })
            .catch(err => {
                console.log(err.error);
                return err.response.data;
            });
        };
        const gameInit = (): void => {
            store.commit('game/initFirstTurn');
        };
        const battleStart = (): boolean => store.state.game.battleStart;
        const getCharacterDetails = (): ICharacter => {
            const character = store.getters['game/getState']('character');
            return character;
        };
        const getCharacterSkills = (): ISkills[] => {
            const character: ICharacter = store.getters['game/getState']('character');
            return character.skills;
        };
        const getCharacterEquipment = (): IItem[] => {
            const character: ICharacter = store.getters['game/getState']('character');
            return Object.keys(character.equipment).map(key => character.equipment[key]);
        };
        const getWinner = ():boolean => {
            return store.getters['game/isWinner']();
        };
        const gameReset = (): void => store.commit('game/reset', getDefaultPerson);
        const gameResult = (): void => {
            router.push('/game/fightresult');
        };

        return {
            initFromSession,
            randomAction,
            initOptions,
            battleStart,
            getDefaultPerson,
            getRandomMonsters,
            getCharacterImage,
            getCharacterTypeName,
            getCharacterDetails,
            getCharacterSkills,
            getCharacterEquipment,
            getWinner,
            gameReset,
            gameInit,
            gameResult,

            // Http Call
            signUp,
            loginRequest
        }
    }
    export default useMonsterSlayerService;
</script>