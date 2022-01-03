<template>
	<div class="skills-layout">
        <div class="grid-container">
            <div class="skills-list">
                <div class="label"> SKILLS</div>
                <p class="skills-class" v-for="(skill, index) in skillList" :key="`skill-${index}`"> <img class="logo-img" :src="`${cardslogo}`" >
                    <span class="skills-description" @click="skillInfo(skill)">{{skill?.name ?? ''}}</span>
                    <span class="skills-equip" @click="equipSkill(skill)" v-if="!skill.equipped" v-bind:class="{ 'disabled-equip': currentSkills?.lenght > 2 }">EQUIP</span>
                    <span class="skills-equipped" v-if="skill.equipped">EQUIPPED</span>
                </p>
            </div>
            <div class="right-side-grid">
                <div class="details">
                    <div class="label"> DETAILS</div>
                    <div v-show="!!skillDetails?.name" >
                        <img class="cards-img" :src="`${cardsImg}`">
                        <span class="skill-title">{{skillDetails?.name ?? ''}}</span>
                        <span class="skill-mana">{{`${Math.abs(skillDetails?.cost ?? 0)}`}}</span>
                        <span class="skill-damage">{{skillDetails?.target != 'self' ? Math.abs(skillDetails?.damage ?? 0) : 0}}</span>
                        <span class="skill-heal">{{skillDetails?.target === 'self' ? Math.abs(skillDetails?.damage ?? 0) : 0}}</span>
                        <span class="skill-target">{{`Target: ${skillDetails?.target ?? ''}`}}</span>
                        <span class="skill-type">{{`Type: ${skillDetails?.type ?? ''}`}}</span>
                    </div>
                    <div v-show="!skillDetails?.name">
                        <p class="default-details">Click Skill to show details.</p>
                    </div>
                </div>
                <div class="equipped">
                    <div class="label"> EQUIPPED</div>
                    <p class="skills-class" v-for="(skill, index) in currentSkills" :key="`skill-${index}`"> <img class="logo-img" :src="`${cardslogo}`" >
                        <span class="skills-description" @click="skillInfo(skill)">{{skill?.name ?? ''}}</span>
                        <span class="unequip" @click="removeSkill(skill)">X</span>
                    </p>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */

	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { ISkills } from "@/store/types";
    import { computed, defineComponent, ref } from "vue";
    const cardsImg = require('@/assets/skills/archer-arrowAssault.png');
    const cardslogo = require('@/assets/skills/archer-arrowAssault-logo.png');

	const SkillsScreen = defineComponent({
		setup() {
            const service = useMonsterSlayerService();
            const skills = ref<ISkills[]>(service.getCharacterSkills());
            const allSkills = ref<ISkills[]>(service.getSkills());
            const skillDetails = ref<ISkills>();
			const skillList = computed(() => {
                allSkills.value?.forEach(skill => {
                    if (skills.value.find(s => s._id === skill._id)) {
                        skill.equipped = true;
                    } else {
                        skill.equipped = false;
                    }
                })
                return allSkills.value;
            });

            const currentSkills = computed(() => {
                return skills.value;
            });

            const skillInfo = (skill: ISkills): void => {
                skillDetails.value = {...skill};
            };

            const equipSkill = (skill: ISkills): void => {
                if (skills.value?.length >= 3) return;
                if (confirm("Continue equip?")) {
                    const skillsUpdate: string[] = [skill._id];
                    skills.value.forEach(s => {
                        skillsUpdate.push(s._id);
                    });
                    updateSkills(skillsUpdate);
                }
            };
            const updateSkills = (update: string[]): void => {
                service.updateSkills(update)
                .then(() => {
                    skills.value = service.getCharacterSkills();
                    allSkills.value = service.getSkills();
                });
            };
            const removeSkill = (skill: ISkills): void => {
                if (confirm("Continue delete?")) {
                    const skillIndex = skills.value.findIndex(s => s._id === skill._id);
                    skills.value.splice(skillIndex, 1);
                    const skillUpdates = skills.value.map(s => s._id);
                    updateSkills(skillUpdates);
                }
            };

			return {
                currentSkills,
                skillList,
                cardsImg,
                cardslogo,
                skillInfo,
                equipSkill,
                removeSkill,
                skillDetails
			};
		}
	})
	export default SkillsScreen;
</script>
<style scoped>
	.skills-layout {
		background:transparent;
		margin: auto;
	}
    p {
        padding:0;
        margin: 1rem;
        color: #5f330e;
    }

    .grid-container {
        display: grid;
        grid-template-columns: 3fr 2fr;
        height: 37.7em;
        width: inherit;
        border: 2px solid #5f330e;
    }
    .grid-container .label {
        margin: 5px 0px;
    }
    .right-side-grid {
        display: grid;
        grid-template-rows: 2fr 1.8fr;
    }
    .details {
        border-bottom: 2px solid #5f330e;
        text-align: center;
    }
    .equipped {
        border-top: 2px solid #5f330e;
    }
    .grid-container > div {
        border: 2px solid #5f330e;
        text-align: left;
    }
    .skills-list {
        overflow-x: hidden;
        overflow-y: auto;
    }
    .cards-img {
        height: 75%;
        width: 75%;
    }
    .logo-img {
        height: 20px;
		width: 20px;
		vertical-align: middle;
		margin: 0 1rem;
		border: 1px solid white;
        border-radius: 5px

    }
    .label {
		text-align: center;
		margin: auto;
		width: 100%;
		font-weight: 900;
		text-transform: uppercase;
		color:saddlebrown;
		font-family: "AxieFont";
	}
    .skills-class{
        text-decoration: none;
        color: #5f330e;
        margin-left: 10px;
    }
    .skills-description{
        text-transform: uppercase;
        font-weight: 800;
        cursor: pointer;
    }
    .skills-description:hover {
        color: whitesmoke;
    }
    .skills-equip {
        font-size: 9px;
        color: #f5d06c;
        float: right;
        font-weight: bolder;
        cursor: pointer;
    }
    .skills-equipped {
        font-size: 9px;
        color: rgb(11, 102, 38);
        float: right;
        cursor: default;
        font-weight: bolder;
    }
    .sub-label {
		text-transform: uppercase;
        font-weight: 800;
	}
    .skill-title {
        text-transform: uppercase;
        color: whitesmoke;
        font-weight: 800;
        top: 11.5%;
        left: 74%;
        font-size: 10px;
        position: absolute;
        text-align: center;
        width: 93px;
    }
    .skill-mana {
        text-transform: uppercase;
        color: rgb(0, 0, 177);
        font-weight: 800;
        top: 10.3%;
        left: 67.5%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-damage {
        text-transform: uppercase;
        color: red;
        font-weight: 800;
        top: 20.6%;
        left: 65%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-heal {
        text-transform: uppercase;
        color: rgb(28, 172, 71);
        font-weight: 800;
        top: 29%;
        left: 65%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-target {
		color: whitesmoke;
		top: 49%;
		left: 32.8rem;
		position: absolute;
		text-transform: capitalize;
    }

	.skill-type {
		color: whitesmoke;
		top: 52%;
		left: 32.8rem;
		position: absolute;
		text-transform: capitalize;
    }
    .unequip {
        color: #f5d06c;
        float: right;
        line-height: 1.5;
        padding-right: 5px;
        cursor: pointer;
    }
    .disabled-equip {
        color:gray;
        cursor: default;
    }
</style>