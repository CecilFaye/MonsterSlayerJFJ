import Vuex, { StoreOptions, useStore } from 'vuex'
import { game } from './modules/game'
import { IRootState } from './types'

const store: StoreOptions<IRootState> = {
	state: {
		version: '1.0.0',
		name: 'Vuezard Quest'
	},
	modules: {
		game
	}
}
export default new Vuex.Store<IRootState>(store);
// export type Store = DocumentsStore<Pick<RootState, 'documents'>>


// const useGameStore = () => {
// 	return useStore<Pick<IGameState>
// }