<template>
	<transition name="fade">
		<div class="battle-controls" v-show="battleStart">
			<button v-for="(skill, index) in actionSkills" :key="`ctrl-${index}`" @click="action(skill)" :disabled="!playerTurn">
				{{skill.name}}
			</button>
		</div>
	</transition>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { ActivityStateOptions, IAction, ISkill, PersonType } from "@/store/types";
    import { computed, defineComponent, watch } from "vue";
    import { useStore } from "vuex";

	const BattleControlWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();

            // Methods
			const action = (skill: ISkill): void => {
				store.commit('game/action', { personType: PersonType.Player, actionTaken: skill} as IAction);
			};

			watch(() => store.state.game[`${PersonType.Monsters}`].turn, (value, oldValue) => {
				if (value) {
					setTimeout(() => {
						const skills: ISkill[] = store.getters['game/getSkills'](PersonType.Monsters);
						const monsterAttack = skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle)[service.randomAction(skills.length-1)];
						store.commit('game/action', { personType: PersonType.Monsters, actionTaken:  monsterAttack} as IAction);
					}, 2000);
				}
			});

			// Computed
			const actionSkills = computed(() => {
				const skills: ISkill[] = store.getters['game/getSkills']('player');
				return skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle);
			});
			const playerTurn = computed(() => {
				return store.state.game.player.turn;
			});
			const battleStart = computed(() => {
				return store.state.game.battleStart;
			});
            return {
                action,
				playerTurn,
				battleStart,
                actionSkills
			}
        }
	})
	export default BattleControlWidget;
</script>
<style scoped>
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
    .battle-controls {
        width: 50%;
		max-width: 50%;
		margin: 1rem;
	}
</style>