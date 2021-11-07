
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

export interface IRootState {
    version: string;
    name: string;
}

export interface IState {
    screenOptions: string[];
	currentScreen: string;
    fightLogs: string[];
    battleStart: boolean;

    // NEW STATE
    account: IAccount;
    character: ICharacter;
    characterState: ICharacterState;
    // NOTE: This is to assume that there will only be 1 enemy at a given battle
    enemyState: ICharacterState;

    // OLD STATE
	player: IPersonState;
    monster: IPersonState;
}

export interface IMonsterSlayerService {
    getDefaultPerson: (type: PersonType) => IPersonState;
    randomAction: (limit: number) => number;
    initOptions: (person: IPersonState) => IPersonState;
    getRandomMonsters: () => IPersonState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCharacterImage: (personType: PersonType, type: ActivityStateOptions) => any;

    // Http Call
    loginRequest: (username: string, password: string) => Promise<IAccount>;
    createAccountRequest: (account: IAccount) => Promise<IAccount>;
    getCharacterRequest: (accountId: number) => Promise<ICharacter>;
}

export interface IAction {
    personType: PersonType;
    actionTaken: ISkill;
}

export interface StyleInterface {
    [x: string]: string
}

export interface IAccount {
    fullName: string,
    email: string,
    username: string,
    password: string,
    characterName: string,
    // The character’s class type. Allowed values are 1, 2, 3, 4 and 5.
    classType: number
}

export interface ICharacter {
    stats: IStats,
    equipment: IEquipment,

    _id: string,
    name: string,
    accountId: string,
    level: number,

    dungeonAccess: INameIdPair[],
    skills: ISkills[],
    classType: number,
    nextLevelExp: number,
    totalExp: number,
}

export interface ICharacterState extends ICharacter {
    activityState: ActivityStateOptions;
    activityStateOptions: ActivityStateOptions[];
}

export interface IStats {
    health: number,
    mana: number,
    off: number,
    def: number,
    agi: number,
    int: number,
    luk: number
}

export interface IEquipment {
    weapon: IItem,
    armor: IItem
}

export interface IItem {
    _id: string,
    bonus: IStats,
    classId: number,
    name: string,
    // Determines whether item is a weapon (WPN) or an armor (AMR)
    type: string
}

export interface INameIdPair {
    _id: string,
    name: string,
}

export interface ISkills {
    _id: string,
    name: string,
    classId: number,
    damage: number,
    target: string,
    cost: number,
    type: string
}






// ##############################################
// OLD

export interface IPersonState extends IStats {
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