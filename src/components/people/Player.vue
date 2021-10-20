<template>
    <div class="person">
        <div class="person-image">
            <img v-for="(skill, index) in playerSkills"
				:key="`skill-${index}`"
				:src="`${getImage(skill.skillType)}`"
				v-show="playerState === skill.skillType"
			>
        </div>
		<div class="group-container">
			<div class="health-bar">
				<div id="playerHealthBar" class="inner-health-bar"></div>
			</div>
		</div>
		<h3>{{playerInfo.name}}</h3>
    </div>
</template>

<script lang="ts">
	import { computed, defineComponent } from "vue";
    import { mapState, useStore } from "vuex";
	import { ActivityStateOptions } from "@/store/types";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const idleStance = require('../../assets/hero/idle.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const attackStance = require('../../assets/hero/attack.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const focusStance = require('../../assets/hero/focus.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const skillStance = require('../../assets/hero/attack.gif');


	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const actionImages = {
		[ActivityStateOptions.Idle]: idleStance,
		[ActivityStateOptions.Attack]: attackStance,
		[ActivityStateOptions.Focus]: focusStance,
		[ActivityStateOptions.Skill1]: skillStance,
		[ActivityStateOptions.Skill2]: skillStance,
		[ActivityStateOptions.Skill3]: skillStance
	};

	const Player = defineComponent({
		props: [],
		setup() {
			const store = useStore();
			const playerSkills = computed(() => {
				return store.getters['game/getSkills']('player');
			});
			const playerInfo = computed(() => store.state.game.player);
			const playerState = computed(() => store.state.game.player.currentState.activityState);
			const getImage = (type: ActivityStateOptions) => {
				return actionImages[type];
			};

			return {
				getImage,
				store,
				playerInfo,
				playerState,
				playerSkills,
			}
		}
	})
	export default Player;
</script>
<style scoped>
	.person {
		height: 100%;
	}
</style>
