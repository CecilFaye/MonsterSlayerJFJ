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

	// Player State
	player: IPersonState;
    // Enemy State
    monster: IPersonState;
}

export interface IMonsterSlayerService {
    getDefaultPerson: (type: PersonType) => IPersonState;
    randomAction: () => number;
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
    Skill3 = 'skill3'
}
