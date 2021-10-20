<template>
	<div id="app">
		<HomeScreen v-show="currentScreen === 'homeScreen'"/>
		<CreditScreen v-show="currentScreen === 'creditScreen'"/>
		<GameScreen v-show="currentScreen === 'gameScreen'"/>
		<FightResultScreen v-show="currentScreen === 'fightResultScreen'"/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, inject } from 'vue';
	import { mapState, useStore } from 'vuex';
	import { IMonsterSlayerService } from './store/types';

	import HomeScreen from '@/components/screens/HomeScreen.vue'
	import CreditScreen from './components/screens/CreditScreen.vue'
	import GameScreen from './components/screens/GameScreen.vue'
	import FightResultScreen from './components/screens/FightResultScreen.vue'

	const App = defineComponent({
		name: 'App',
		components: {
			HomeScreen,
			CreditScreen,
			GameScreen,
			FightResultScreen
		},
		setup() {
			const service = inject('serviceInstance') as IMonsterSlayerService;
			const store = useStore();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const currentScreen = computed(() => store.state.game.currentScreen)
			return {
				currentScreen,
				service,
				store
			}
		}
	});

	export default App;
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	#app {
		font-family: 'Helvetica', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
