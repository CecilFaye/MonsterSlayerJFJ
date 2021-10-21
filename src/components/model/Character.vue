<template>
    <div class="person">
		<div class="name">
			<span class="char-name">{{personInfo.name}}</span>
		</div>
		<HealthBarWidget :personType="personInfo.personType"/>
		<ManaBarWidget :personType="personInfo.personType"/>
        <div class="person-image">
            <img v-for="(skill, index) in personSkills"
				:key="`skill-${index}`"
				:src="`${getCharacterImage(skill.skillType)}`"
				v-show="personState === skill.skillType"
			>
        </div>
    </div>
</template>

<script lang="ts">
	import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";
	import { ActivityStateOptions, PersonType } from "@/store/types";
	import HealthBarWidget from "../widget/HealthBar.vue";
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import ManaBarWidget from "../widget/ManaBar.vue";

	const Character = defineComponent({
		props: {
			personType: { type: String }
		},
		components: {
			HealthBarWidget,
			ManaBarWidget
		},
		setup(props) {
			// Hooks
			const store = useStore();
			const service = useMonsterSlayerService();

			// Computed
			const personSkills = computed(() => store.getters['game/getSkills'](props.personType));
			const personInfo = computed(() => store.state.game[`${props.personType}`]);
			const personState = computed(() => store.state.game[`${props.personType}`].currentState.activityState);
			const getCharacterImage = (type: ActivityStateOptions) => service.getCharacterImage(props.personType as PersonType, type);

			return {
				getCharacterImage,
				personInfo,
				personSkills,
				personState
			}
		}
	})
	export default Character;
</script>
<style scoped>
	.char-name {
		color: lightgray;
		font-weight: 900;
		font-size: 2rem;
	}
	.person {
		display: flex;
		flex-direction: column;
	}

</style>
