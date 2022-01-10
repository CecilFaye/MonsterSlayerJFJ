/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount, IAccountResponse, IBattleRequest, IBattleResponse, ICharacter, IDungeonResponse, IEnterDungeonRequest, IEnterDungeonResponse, IEquipment, IEquipmentRequest, IInventory, IItem, ISkills } from "@/store/types";
import { useMonsterSlayerService } from "@/services/monster-slayer-service";
import axios from "axios";
import { apiUrl } from "@/app-lib/constant/app-config";

export interface IMonsterSlayerRequest {
    signup: (account: IAccount) => Promise<any>;
    login: (username: string, password: string) => Promise<any>;
    getCharacter: (accountId: string) => Promise<ICharacter>;
    getSkills: (accountId: string) => Promise<ISkills[]>;
    getInventory: (characterId: string) => Promise<IInventory[]>;
    getDungeons: (accountId: string) => Promise<IDungeonResponse[]>;
    putEquipment: (characterId: string, equipment: IEquipmentRequest) => Promise<boolean>;
    putSkills: (characterId: string, skills: string[]) => Promise<boolean>;
    deleteItem: (characterId: string, itemId: string) => Promise<boolean>;
    enterDungeon: (dungeon: IEnterDungeonRequest) => Promise<IEnterDungeonResponse>;
    batleDungeon: (dungeon: IBattleRequest) => Promise<IBattleResponse>;
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
        getCharacter: (accountId: string): Promise<ICharacter> => {
            const service = useMonsterSlayerService();
            return axios.get(`${apiUrl}/accounts/${accountId}/character`)
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
                    console.log('SUCCESS GET INVENTORY');
                    return result.data as IInventory[];
                }
                console.log('ERROR GET INVENTORY');
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
            return axios.get(`${apiUrl}/character/${accountId}/skills`)
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
        putEquipment: (characterId: string, equipment: IEquipmentRequest): Promise<boolean> => {
            return axios.put(`${apiUrl}/character/${characterId}/equipment`, equipment)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        },
        putSkills: (characterId: string, items: string[]): Promise<boolean> => {
            return axios.put(`${apiUrl}/character/${characterId}/skills`, items)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        },
        deleteItem: (characterId: string, itemId: string): Promise<boolean> => {
            return axios.delete(`${apiUrl}/character/${characterId}/inventory/${itemId}`)
            .then(result => result.status === 200)
            .catch(err => {
                return err.response.data;
            });
        },
        enterDungeon: (dungeon: IEnterDungeonRequest): Promise<IEnterDungeonResponse> => {
            return axios.post(`${apiUrl}/dungeons/enter`, dungeon)
            .then(result => {
                if(result.status === 200) {
                    return result.data;
                }
            })
            .catch(err => {
                return err.response.data;
            });
        },
        batleDungeon: (dungeon: IBattleRequest): Promise<IBattleResponse> => {
            return axios.post(`${apiUrl}/dungeons/battle`, dungeon)
            .then(result => {
                if(result.status === 200) {
                    return result.data;
                }
            })
            .catch(err => {
                return err.response.data;
            });
        }

    }
}
export default useMonsterSlayerRequest;
