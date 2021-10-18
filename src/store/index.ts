import { createStore, StoreOptions } from 'vuex'
import { RootState } from './types'
import { game } from './modules'

const store: StoreOptions<RootState> = {
	state: {
		version: '1.0.0',
		name: 'Vuezard Quest'
	},
	modules: {
		game
	}
}
export default createStore<RootState>(store);
