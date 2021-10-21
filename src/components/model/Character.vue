<template>
    <div class="person">
        <div class="person-image">
            <img v-for="(skill, index) in personSkills"
				:key="`skill-${index}`"
				:src="`${getCharacterImage(skill.skillType)}`"
				v-show="personState === skill.skillType"
			>
        </div>
		<div class="group-container">
			<HealthBarWidget :personType="personInfo.personType"/>
		</div>
		<h3>{{personInfo.name}}</h3>
    </div>
</template>

<script lang="ts">
	import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";
	import { ActivityStateOptions, PersonType } from "@/store/types";
	import HealthBarWidget from "../widget/HealthBar.vue";
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";

	const Character = defineComponent({
		props: {
			personType: { type: String }
		},
		components: {
			HealthBarWidget
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
	.person {
		height: 100%;
	}
</style>
