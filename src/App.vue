<template>
	<div id="app">
		<HomeScreen v-show="currentScreen === 'homeScreen'"/>
		<CreditScreen v-show="currentScreen === 'creditScreen'"/>
		<GameScreen v-show="currentScreen === 'gameScreen'"/>
		<FightResultScreen v-show="currentScreen === 'fightResultScreen'"/>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import HomeScreen from '@/components/screens/HomeScreen.vue'
	import CreditScreen from './components/screens/CreditScreen.vue'
	import GameScreen from './components/screens/GameScreen.vue'
	import FightResultScreen from './components/screens/FightResultScreen.vue'
	import { mapState } from 'vuex';

	const App = defineComponent({
		name: 'App',
		components: {
			HomeScreen,
			CreditScreen,
			GameScreen,
			FightResultScreen
		},
		computed: {
			...mapState({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				currentScreen: (state: any) => state.game.currentScreen
			})
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
