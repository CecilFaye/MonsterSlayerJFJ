<template>
	<div class="skills-layout">
        <div>
            <ul>
                <li v-for="(skill, index) in skills" :key="`skill-${index}`">{{skill.name}}</li>
            </ul>
        </div>
         <div>
            <!-- skill model here -->
        </div>
	</div>
</template>

<script lang="ts">
	import { ActivityStateOptions, ISkill } from "@/store/types";
    import { computed, defineComponent, ref } from "vue";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";

	// const { params } = useRoute();
	const SkillsScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const store = useStore();

            const skills = computed(() => {
				const skills: ISkill[] = store.getters['game/getSkills']('player');
				return skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle);
			});

            const skillInfo = (id: string) => {
                // const skills: ISkill[] = store.getters['game/getSkills']('player');
                return '';
            };

			return {
                skills,
                skillInfo
			};
		}
	})
	export default SkillsScreen;
</script>
<style scoped>
	.skills-layout {
		height: inherit;
		width: inherit;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
        background:lightcoral;
	}
</style>