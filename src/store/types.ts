export interface RootState {
    version: string;
    name: string;
}

export enum ScreenStateOptions {
    HomeScreen = 'homeScreen',
    CreditScreen = 'creditScreen',
    GameScreen = 'gameScreen',
    FightResultScreen = 'fightResultScreen'
}

export enum ActivityStateOptions {
    Idle = 'idle',
    Attacking = 'attacking',
    Focus = 'focus',
    Skill1 = 'skill1',
    Skill2 = 'skill2',
    Skill3 = 'skill3'
}
