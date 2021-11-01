<template>
	<div id="app">
		<HomeScreen v-if="currentScreen === 'homeScreen'"/>
		<CreditScreen v-if="currentScreen === 'creditScreen'"/>
		<GameScreen v-if="currentScreen === 'gameScreen'"/>
		<FightResultScreen v-if="currentScreen === 'fightResultScreen'"/>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { useStore } from 'vuex';

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
			const store = useStore();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const currentScreen = computed(() => {
				console.log(store.state.game.currentScreen);
				return store.state.game.currentScreen;
			});
			return {
				currentScreen,
			}
		}
	});

	export default App;
</script>

<style>
	html, body {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	#app {
		font-family: 'Helvetica', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	@font-face {
font-family: "AxieFont";
src:url('~@/assets/KOMIKAX_.ttf') format("truetype");
}
</style>
