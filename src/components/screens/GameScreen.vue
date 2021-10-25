
<template>
	<div class="game-screen" :style="`background-image:url(${(screenImage)});`">
		<div class="main-container">
			<div class="people-container">
				<div class="person-container player">
					<Character :personType="'player'"/>
				</div>
				<div class="person-container monster">
					<Character :personType="'monster'"/>
				</div>
			</div>
			<div class="main-controls">
				<BattleControlWidget/>
				<LogsControlWidget/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { defineComponent, onBeforeMount } from "vue";
	import { PersonType } from "@/store/types";
	import { useStore } from "vuex";
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import Character from "../model/Character.vue";
	import BattleControlWidget from "../widget/BattleControls.vue";
	import LogsControlWidget from "../widget/Logs.vue";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/inside-castle.jpg');

	const GameScreen = defineComponent({
		props: [],
		components: {
			Character,
			BattleControlWidget,
			LogsControlWidget
		},
		setup() {
			// Properties
			const screenImage = screenGif;

			// Hooks
			const service = useMonsterSlayerService();
			const store = useStore();

			// Lifecycle Hooks
			onBeforeMount(() => {
				store.commit('game/initializePlayer', service.getDefaultPerson(PersonType.Player));
				store.commit('game/initializeMonster', service.getDefaultPerson(PersonType.Monsters));
			});

			return {
				screenImage,
			}
		}
	})
	export default GameScreen;
</script>

<style scoped>
	.main-container {
		padding: 3rem;
		margin: auto;
	}
	.people-container {
		display: flex;
	}

	.game-screen {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 100vh;

		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
	}

	button {
		margin: 5px;
		min-width: 100px;
		min-height: 2rem;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		padding: 0.7rem;
		text-transform: uppercase;
	}

	.main-controls {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.person-container {
		height: 95%;
	}
</style>