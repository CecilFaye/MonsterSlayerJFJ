
<template>
	<div v-show="showEntrance" >
		<img class="entrance-screen" :src="screenGif" >
	</div>
	<transition name="fade">
		<div v-if="!showEntrance" class="game-screen" :style="`background-image:url(${(screenBackground)});`">
			<div class="main-container">
				<div class="people-container">
					<div class="person-container player">
						<Character :personType="'player'"/>
					</div>
					<div class="person-container center-images">
						<transition name="fade">
							<img class="versus"  v-show="battleStart" :src="`${vsGif}`">
						</transition>
						<transition name="fade">
							<img v-show="showFightImage" :src="`${fightGif}`">
						</transition>
					</div>
					<div class="person-container monster">
						<Character :personType="'monster'"/>
					</div>
				</div>
				<div class="center-notif">

				</div>
				<div class="main-controls">
					<BattleControlWidget/>
					<LogsControlWidget/>
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
	import { useStore } from "vuex";
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import Character from "../model/Character.vue";
	import BattleControlWidget from "../widget/BattleControls.vue";
	import LogsControlWidget from "../widget/Logs.vue";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenBackground = require('../../assets/background/inside-castle.jpg');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/before-fight.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const vsGif = require('../../assets/background/versus.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fightGif = require('../../assets/background/fight.gif');

	const GameScreen = defineComponent({
		props: [],
		components: {
			Character,
			BattleControlWidget,
			LogsControlWidget
		},
		setup() {
			// Properties
			const showEntrance = ref<boolean>(true);
			const showFightImage = ref<boolean>(true);

			// Hooks
			const service = useMonsterSlayerService();
			const store = useStore();

			onBeforeMount(() => {
				store.commit('game/reset', service);
			});

			setTimeout(() => {
				showEntrance.value = false;
			},2800);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			watch(() => showEntrance.value, (value: boolean, oldValue: boolean) => {
				if (!value) {
					setTimeout(() => {
						showFightImage.value = false;
						setTimeout(() => store.commit('game/initFirstTurn'), 1000);
					}, 2000);
				}
			});

			const battleStart = computed(() => {
				return store.state.game.battleStart;
			});

			return {
				screenBackground,
				screenGif,
				vsGif,
				fightGif,
				showEntrance,
				showFightImage,
				battleStart
			}
		}
	})
	export default GameScreen;
</script>

<style scoped>
	.main-container {
		padding: 5rem;
		margin: auto;
	}
	.people-container {
		display: flex;
	}

	.game-screen {
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
		background: white;

		/* Full height */
		height: 100vh;

		/* Center and scale the image nicely */
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
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

	.battle-logs {
		width: 50%;
		max-width: 50%;
		margin: 1rem;
	}

	.battle-logs {
		display: flex;
		flex-direction: column;
		min-height: fit-content;
	}
	.entrance-screen {
		width: 100%;
		width: 100%;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
	.versus {
		width: 100px;
		height: 100px;
	}
	.center-images {
		display: flex;
		flex-direction: column;
	}
</style>