export interface IPersonState {
    health: number;
    maxHealth: number;
    currentState: IStatus;
}

export interface IStatus {
    activityState: string;
    activityStateOptions: string[];

    // (Optional if we have time) Only 1 effect for now
    // statusEffectState: string;
    // statusEffectStateOptions: string[];
}

export interface IState {
    screenOptions: string[];
	currentScreen: string;

	// Player State
	player: IPersonState;
    // Enemy State
    monster: IPersonState;
}
