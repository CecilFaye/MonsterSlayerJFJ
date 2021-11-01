export interface IRootState {
    version: string;
    name: string;
}

export interface IPersonState {
    id: number;
    name: string;
    personType: PersonType;
    image: string;
    maxHealth: number;
    maxMana: number;
    attack: ISkill;
    focus: ISkill;
    skills: ISkill[];
    turn: boolean;
    currentState: IStatus;
}

export interface ISkill {
    id: number;
    name: string;
    skillType: ActivityStateOptions;
    image: string;
    timeout: number;
    manaCost: number;
    icon: string;
    damage: number;
    manaIncrement: number;
    healthIncrement: number;
    disabled: boolean;
}

export interface IStatus {
    health: number;
    mana: number;

    activityState: ActivityStateOptions;
    activityStateOptions: ActivityStateOptions[];

    // (Optional if we have time) Only 1 effect for now
    // statusEffectState: string;
    // statusEffectStateOptions: string[];
}

export interface IState {
    screenOptions: string[];
	currentScreen: string;
    fightLogs: string[];
    battleStart: boolean;

	// Player State
	player: IPersonState;
    // Enemy State
    monster: IPersonState;
}

export interface IMonsterSlayerService {
    getDefaultPerson: (type: PersonType) => IPersonState;
    randomAction: (limit: number) => number;
    initOptions: (person: IPersonState) => IPersonState;
    getRandomMonsters: () => IPersonState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCharacterImage: (personType: PersonType, type: ActivityStateOptions) => any;
}

export interface IAction {
    personType: PersonType;
    actionTaken: ISkill;
}

export enum PersonType {
    Player = 'player',
    Monsters = 'monster'
}

export enum ScreenStateOptions {
    HomeScreen = 'homeScreen',
    CreditScreen = 'creditScreen',
    GameScreen = 'gameScreen',
    FightResultScreen = 'fightResultScreen'
}

export enum ActivityStateOptions {
    Idle = 'idle',
    Attack = 'attack',
    Focus = 'focus',
    Skill1 = 'skill1',
    Skill2 = 'skill2',
    Skill3 = 'skill3',

    // Failed Attack if Mana < Mana Cost
    Failed = 'failed'
}

export interface StyleInterface {
    [x: string]: string
  }
