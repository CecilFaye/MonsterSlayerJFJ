<template>
	<div class="battle-controls">
        <button v-for="(skill, index) in actionSkills" :key="`log-${index}`" @click="action(skill)">
            {{skill.name}}
        </button>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { ActivityStateOptions, IAction, ISkill, PersonType } from "@/store/types";
    import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";

	const BattleControlWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();

            // Methods
			const action = (skill: ISkill): void => {
				store.commit('game/action', { personType: PersonType.Player, actionTaken: skill} as IAction);

				// TODO: Transfer this to mutation or action
				setTimeout(() => {
					const skills: ISkill[] = store.getters['game/getSkills'](PersonType.Monsters);
					const monsterAttack = skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle)[service.randomAction(skills.length-1)];
					store.commit('game/action', { personType: PersonType.Monsters, actionTaken:  monsterAttack} as IAction);
				}, 2000);
			};

			// Computed
			const actionSkills = computed(() => {
				const skills: ISkill[] = store.getters['game/getSkills']('player');
				return skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle);
			});
            return {
                action,
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