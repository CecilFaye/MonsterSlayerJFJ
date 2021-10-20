import Vuex, { StoreOptions } from 'vuex'
import { IRootState } from './types'
import { game } from './modules'

const store: StoreOptions<IRootState> = {
	state: {
		version: '1.0.0',
		name: 'Vuezard Quest'
	},
	modules: {
		game
	}
}
export default new Vuex.Store<IRootState>(store)
