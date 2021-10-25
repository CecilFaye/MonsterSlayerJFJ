
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
							<img style="z-index: 10000 !important; position: abosulte;" v-show="showFightImage" :src="`${fightGif}`">
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
	import { PersonType } from "@/store/types";
	import { useStore } from "vuex";
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
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

			// Lifecycle Hooks
			onBeforeMount(() => {
				store.commit('game/initializePlayer', service.getDefaultPerson(PersonType.Player));
				store.commit('game/initializeMonster', service.getDefaultPerson(PersonType.Monsters));
			});

			setTimeout(() => {
				showEntrance.value = false;
			},2800);

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
		background: white;
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