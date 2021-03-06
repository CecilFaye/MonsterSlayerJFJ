/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export enum storageNames {
    account = 'account',
    character = 'character',
    inventory = 'inventory',
    dungeons = 'dungeons',
    skills = 'skills',
    onGoingDungeon = 'onGoingDungeon',
    latestFightResult = 'latestFightResult'
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const saveSession = (name: string, payload: any): void => {
    sessionStorage.setItem(`vuexie/${name}`, JSON.stringify(payload));
}

export const removeSessionValue = (name: string): void => {
    sessionStorage.removeItem(`vuexie/${name}`);
}

export const hasSession = (name: string): boolean => {
    return !!sessionStorage.getItem(`vuexie/${name}`);
}

export const getSessionValue = <T>(name: string): T => {
    return JSON.parse(sessionStorage.getItem(`vuexie/${name}`));
}

export const clearAllSessionValues = (): void => {
    sessionStorage.clear();
}