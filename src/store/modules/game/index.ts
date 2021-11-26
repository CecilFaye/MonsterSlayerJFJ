import { IRootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { gameState, IGameState } from "./state";


export const game: Module<IGameState, IRootState> = {
    actions,
    mutations,
    getters,
    state: gameState,
    namespaced: true
}