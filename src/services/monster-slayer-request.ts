/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount, IAccountResponse, ICharacter, IDungeonResponse, IEquipment, IInventory, IItem, ISkills } from "@/store/types";
import { useMonsterSlayerService } from "@/services/monster-slayer-service";
import axios from "axios";
import { apiUrl } from "@/app-lib/constant/app-config";

export interface IMonsterSlayerRequest {
    signup: (account: IAccount) => Promise<any>;
    login: (username: string, password: string) => Promise<any>;
    getCharacter: (account: IAccount) => Promise<ICharacter>;
    getSkills: (accountId: string) => Promise<ISkills[]>;
    getInventory: (accountId: string) => Promise<IInventory[]>;
    getDungeons: (accountId: string) => Promise<IDungeonResponse[]>;
    putEquipment: (accountId: string, equipment: IEquipment) => Promise<boolean>;
    putSkills: (accountId: string, skills: string[]) => Promise<boolean>;
    deleteItem: (accountId: string, itemId: string) => Promise<boolean>;
}

const useMonsterSlayerRequest = (): IMonsterSlayerRequest => {
    return {
        signup: (account: IAccount) : Promise<any> => {
            return axios.post(`${apiUrl}/accounts`, account)
            .catch(err => {
                return err.response.data;
            });
        },
        login: (username: string, password: string): Promise<IAccountResponse> => {
            return axios.post(`${apiUrl}/accounts/login`, {
                username,
                password
            })
            .then(result => {
                if (result.status === 200)   {
                    return result.data as IAccountResponse;
                }
                return null;
            })
            .catch(err => {
                return err.response.data;
            });
        },
        getCharacter: (account: IAccount): Promise<ICharacter> => {
            const service = useMonsterSlayerService();
            return axios.get(`${apiUrl}/accounts/${account.accountId}/character`)
                .then(result => {
                    if (result.status === 200) {
                        const character = result.data as ICharacter;
                        character.classTypeName = service.getCharacterTypeName(character.classType);
                        return character;
                    } return null;
                })
                .catch(err => {
                    return err.response.data;
                });
        },
        getInventory: (accountId: string): Promise<IInventory[]> => {
            return axios.get(`${apiUrl}/character/${accountId}/inventory`)
            .then(result => {
                if (result.status === 200) {
                    return result.data as IInventory[];
                }
                return [];
            })
            .catch(err => {
                return err.response.data;
            });
        },
        getDungeons: (accountId: string): Promise<IDungeonResponse[]> => {
            return axios.get(`${apiUrl}/character/${accountId}/dungeons`)
            .then(result => {
                if (result.status === 200) {
                    return result.data as IDungeonResponse[];
                }
                return [];
            })
            .catch(err => {
                return err.response.data;
            });
        },
        getSkills: (accountId: string): Promise<ISkills[]> => {
            return axios.get(`${apiUrl}/character/${accountId}/inventory`)
            .then(result => {
                if (result.status === 200) {
                    return result.data as ISkills[];
                }
                return [];
            })
            .catch(err => {
                return err.response.data;
            });
        },
        putEquipment: (accountId: string, equipment: IEquipment): Promise<boolean> => {
            return axios.put(`${apiUrl}/character/${accountId}/equipment`, equipment)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        },
        putSkills: (accountId: string, items: string[]): Promise<boolean> => {
            return axios.put(`${apiUrl}/character/${accountId}/skills`, items)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        },
        deleteItem: (accountId: string, itemId: string): Promise<boolean> => {
            return axios.delete(`${apiUrl}/character/${accountId}/inventory/${itemId}`)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        }

    }
}
export default useMonsterSlayerRequest;
