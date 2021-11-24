/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IAccountResponse } from "@/store/types";

export enum storageNames {
    account = 'account',
    character = 'character'
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

export const getSessionValue = (name: string): IAccountResponse => {
    return JSON.parse(sessionStorage.getItem(`vuexie/${name}`));
}

export const clearAllSessionValues = (): void => {
    Object.keys(storageNames).forEach(key => removeSessionValue(key));
}