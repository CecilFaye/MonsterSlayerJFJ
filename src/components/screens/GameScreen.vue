
<template>
	<div class="game-screen" :style="`background-image:url(${(screenImage)});`">
		<div class="main-container">
			<div class="people-container">
				<div class="person-container player">
					<Player/>
				</div>
				<div class="person-container monster">
					<Monster />
				</div>
			</div>
			<div class="main-controls">
				<div class="battle-controls">
					<button
						v-for="(skill, index) in actionSkills" :key="`log-${index}`"
						@click="action(skill)">{{skill.name}}</button>
				</div>
				<div class="battle-logs">
					<label v-for="(log, index) in logs" class='log' :key="`log-${index}`">{{ log }}</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { computed, defineComponent, onBeforeMount } from "vue";
	import { ActivityStateOptions, IAction, ISkill, PersonType } from "@/store/types";
	import { useStore } from "vuex";
	import * as MonsterSlayerService from "@/services/monster-slayer.factory"
	import Player from "../people/Player.vue";
	import Monster from "../people/Monster.vue";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/castle.gif');

	const GameScreen = defineComponent({
		props: [],
		components: {
			Player,
			Monster
		},
		setup() {

			// Properties
			const screenImage = screenGif;
			const service = MonsterSlayerService;
			const store = useStore();

			// Hooks
			onBeforeMount(() => initializeAll());

			// Methods
			const initializeAll = (): void => {
				store.commit('game/initializePlayer', service.default.getDefaultPerson(PersonType.Player));
				store.commit('game/initializeMonster', service.default.getDefaultPerson(PersonType.Monsters));
			};

			const action = (skill: ISkill): void => {
				store.commit('game/action', { personType: PersonType.Player, actionTaken: skill} as IAction);
			};

			// Computed
			const actionSkills = computed(() => {
				const skills: ISkill[] = store.getters['game/getSkills']('player');
				return skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle);
			});

			return {
				action,
				service,
				screenImage,
				actionSkills
			}
		}
	})
	export default GameScreen;
</script>

<style scoped>
	.main-container {
		width: 70rem;
		height: 60rem;
		padding: 3rem;
		margin: auto;
	}
	.people-container {
		height: 75%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
	.main-container, .people-container, .main-controls,
	.battle-logs, .battle-controls, .person-container {
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
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
		width: inherit;
		height: 25%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.person-container {
		background: lightblue;
		margin: auto 1rem;
		height: 95%;
		width: 450%;
	}

	.player {
		float: left;
	}

	.monster {
		float: right;
	}

	.battle-controls {
		float: left;
	}

	.battle-controls, .battle-logs {
		background: lavender;
		width: 50%;
		max-width: 50%;
		height: 86%;
		margin: 1rem;
	}

	.battle-logs {
		float: right;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>