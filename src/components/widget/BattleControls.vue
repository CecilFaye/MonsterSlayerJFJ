<template>
	<transition name="fade">
		<div class="battle-controls" v-show="battleStart">
			<button v-for="(skill, index) in actionSkills" :key="`ctrl-${index}`" @click="attack(skill)" :disabled="!playerTurn">
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
			const attack = (skill: ISkill): void =>  action(skill, PersonType.Player);

			watch(() => store.state.game[`${PersonType.Monsters}`].turn, (value, oldValue) => {
				if (value) {
					setTimeout(() => {
						const skills: ISkill[] = store.getters['game/getSkills'](PersonType.Monsters);
						const monsterAttack = skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle)[service.randomAction(skills.length-1)];
						action(monsterAttack, PersonType.Monsters);
					}, 2000);
				}
			});

			const action = (skill: ISkill, type: PersonType) => {
				store.commit('game/action',
				{
					work: { personType: type, actionTaken: skill} as IAction,
					reset: service.gameResult
				});
			};

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
                attack,
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

        box-shadow: 0px 4px 5px #00000033;
        border-radius: 30px;
	}
	button:nth-of-type(2n+0) {
		background: dodgerblue 0% 0% no-repeat padding-box;
	}
	button:nth-of-type(3n+0) {
		background: limegreen 0% 0% no-repeat padding-box;
	}
	button:nth-of-type(4n+0) {
		background: mediumblue 0% 0% no-repeat padding-box;
	}
	button:nth-of-type(5n+0) {
		background: red 0% 0% no-repeat padding-box;
	}
    .battle-controls {
        width: 460px;
		max-width: 460px;
		margin: 1rem;
	}
</style>