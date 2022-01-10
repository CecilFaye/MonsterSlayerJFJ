import {
    ActivityStateOptions,
	CharacterTypes, IAccount, ICharacter, ICharacterState, IDungeonResponse, IInventory,
	IPersonState, ISkill, ISkills, PersonType, ScreenStateOptions
} from '@/store/types';

export interface IGameState {
    screenOptions: string[];
    characterTypes: string[];
	currentScreen: string;
    fightLogs: string[];
    battleStart: boolean;

    // NEW STATE
    account: IAccount;
    character: ICharacter;
    skills: ISkills[];
    inventory: IInventory[];
    dungeon: IDungeonResponse[];
    characterState: ICharacterState;
    // NOTE: This is to assume that there will only be 1 enemy at a given battle
    enemyState: ICharacterState;

    // OLD STATE
	player: IPersonState;
    monster: IPersonState;
}

export const gameState = {
    screenOptions: Object.keys(ScreenStateOptions).map(_ => _),
    characterTypes: Object.keys(CharacterTypes),
	currentScreen: 'homeScreen',
    fightLogs: [],
    battleStart: false,
    account: {} as IAccount,
    character: {} as ICharacter,
	// Player State
	player: {} as IPersonState,
    // Monster State
    monster: {} as IPersonState
} as IGameState;