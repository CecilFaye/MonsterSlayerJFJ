<template>
    <div class="person">
        <div class="person-image">
            <img v-for="(skill, index) in monsterSkills"
				:key="`skill-${index}`"
				:src="`${getImage(skill.skillType)}`"
				v-show="monsterState === skill.skillType"
			>
        </div>
		<div class="group-container">
			<div class="health-bar">
				<div id="monsterHealthBar" class="inner-health-bar"></div>
			</div>
		</div>
		<h3>{{monsterInfo.name}}</h3>
    </div>
</template>

<script lang="ts">
	import { ActivityStateOptions } from "@/store/types";
	import { computed, defineComponent } from "vue";
	import { useStore } from "vuex";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const idleStance = require('../../assets/monster/idle.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const attackStance = require('../../assets/monster/attack.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const focusStance = require('../../assets/monster/focus.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const skillStance = require('../../assets/monster/attack.gif');

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const actionImages = {
		[ActivityStateOptions.Idle]: idleStance,
		[ActivityStateOptions.Attack]: attackStance,
		[ActivityStateOptions.Focus]: focusStance,
		[ActivityStateOptions.Skill1]: skillStance,
		[ActivityStateOptions.Skill2]: skillStance,
		[ActivityStateOptions.Skill3]: skillStance
	};

	const Monster = defineComponent({
		props: [],
		setup() {
			const store = useStore();
			const monsterSkills = computed(() => {
				return store.getters['game/getSkills']('monster');
			});
			const monsterInfo = computed(() => store.state.game.monster);
			const monsterState = computed(() => store.state.game.monster.currentState.activityState);
			const getImage = (type: ActivityStateOptions) => {
				return actionImages[type];
			};

			return {
				getImage,
				store,
				monsterState,
				monsterInfo,
				monsterSkills,
			}
		}
	})
	export default Monster;
</script>
<style scoped>

</style>
