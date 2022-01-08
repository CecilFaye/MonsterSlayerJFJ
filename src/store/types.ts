/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGameState } from "./modules/game/state";

export enum StoreModule {
    auth = 'auth',
    game = 'game'
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

export enum Stats {
    health = 'health',
    mana = 'mana',
    off = 'off',
    def = 'def',
    agi = 'agi',
    int = 'int',
    luk = 'luk'
}

export interface IValidationError {
    error: string;
    name: string;
}

export const CharacterTypes = {
    Saber: 1,
    Archer: 2,
    Lancer: 3,
    Berserker: 4,
    Caster: 5
}

export interface IRootState {
    version: string;
    name: string;
}

export interface INameIdPair {
    _id: string;
    name: string;
}

export interface InfoKeyValue {
    key: string;
    [key: string]: any;
}

export interface IAction {
    personType: PersonType;
    actionTaken: ISkill;
}

export interface StyleInterface {
    [x: string]: string;
}

export interface IAccount extends IAccountResponse {
    fullName: string;
    email: string;
    username: string;
    password: string;
    characterName: string;
    // The character’s class type. Allowed values are 1, 2, 3, 4 and 5.
    classType: number;
}

export interface IAccountResponse  {
    accountId: string;
}

export interface ICharacter extends INameIdPair, IAccountResponse {
    stats: IStats;
    equipment: IEquipment;
    level: number;
    dungeonAccess: INameIdPair[];
    skills: ISkills[];
    classType: number;
    classTypeName: string;
    nextLevelExp: number;
    totalExp: number;
}

export interface IDungeonResponse extends INameIdPair {
    image: string;
    recommendedLevel: number;
    bossReq: string;
    locked: boolean;
    enemies: IDungeonEnemy[];
}

export interface IEnterDungeonResponse {
    dungeon: IDungeon;
    enemy: IEnemy;
}

export interface IBattleResponse {
    exp: number;
    lvlUp: boolean;
    drop: string;
    newSkills: string[];
    unlockedDungeons: string[];
}

export interface ICharacterState extends ICharacter {
    turn: boolean;
    currentState: IStatus;
    activityState: ActivityStateOptions;
    activityStateOptions: ActivityStateOptions[];
}

export interface IStats {
    health: number;
    mana: number;
    off: number;
    def: number;
    agi: number;
    int: number;
    luk: number;
}

export interface IEquipment {
    weapon: IItem;
    armor: IItem;
}

export interface IItem extends INameIdPair {
    bonus: IStats;
    classId: number;
    // Determines whether item is a weapon (WPN) or an armor (AMR)
    type: string;
}

export interface IInventory extends INameIdPair  {
    characterId: string;
    item: IItem;
    equipped: boolean;
}

export interface ISkills extends INameIdPair {
    classId: number;
    damage: number;
    target: string;
    cost: number;
    type: string;
    equipped: boolean;
}

export interface IDungeon extends INameIdPair  {
    image: string;
}

export interface IDungeonEnemy extends INameIdPair {
    boss: boolean;
    drops: IEnemyDrop[];
}

export interface IEnemyDrop extends INameIdPair {
    classId: number;
    type: string;
}

export interface IEnemy extends INameIdPair {
    image: string;
    level: number;
    stats: IStats;
    skills: ISkills[];
}


export interface IEquipmentRequest {
    weaponId: string;
    armorId: string;
}

export interface IEnterDungeonRequest {
    characterId: string;
    dungeonId: string;
}

export interface IBattleRequest {
    characterId: string;
    dungeonId: string;
    enemyId: string;
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