<template>
	<div class="skills-layout">
        <div class="division">
            <ul>
                <li v-for="(skill, index) in skills" :key="`skill-${index}`"><span @click="skillInfo(skill)">{{skill?.name ?? ''}}</span></li>
            </ul>
        </div>
         <div class="division">
             <div v-show="!!skillDetails?.name" class="arrangement">
                <span>{{`Name: `}}<span class="skill-text">{{skillDetails?.name ?? ''}}</span></span>
                <span>{{skillDetails?.target === 'self' ? 'Gain: ' : 'Damage: '}}<span>{{Math.abs(skillDetails?.damage ?? 0)}}</span></span>
                <span>{{`Target: `}}<span class="skill-text">{{skillDetails?.target ?? 0}}</span></span>
                <span>{{`Mana Cost: ${Math.abs(skillDetails?.cost ?? 0)}`}}</span>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { ISkills } from "@/store/types";
    import { defineComponent, ref } from "vue";

	const SkillsScreen = defineComponent({
		setup() {
            const service = useMonsterSlayerService();
			const skills = service.getCharacterSkills();
            const skillDetails = ref<ISkills>();

            const skillInfo = (skill: ISkills): void => {
                skillDetails.value = {...skill};
            };
			return {
                skills,
                skillInfo,
                skillDetails
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
        background:transparent;
        display: flex;
        flex-direction: row;
	}
    .division {
        width: 50%;
        padding: 3rem 2rem;
    }
    .arrangement {
        display: flex;
        flex-direction: column;
    }
    span {
		font-size: 20px;
		font-weight: 800;
	}
	.header-stat {
		padding: 10px 0;
	}
    li {
        cursor: pointer;
        text-decoration: none;
    }
    li:hover {
        color: whitesmoke;
    }
    .skill-text {
        text-transform: uppercase;
        color: whitesmoke;
    }
</style>