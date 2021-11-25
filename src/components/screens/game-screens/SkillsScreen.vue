<template>
	<div class="skills-layout">
        <div class="grid-container">
            <div class="item1">
                <span class="label-class"> SKILLS</span> 
                <p class="skills-class" v-for="(skill, index) in skills" :key="`skill-${index}`"> <img class="logo-img" :src="`${cardslogo}`" @click="skillInfo(skill)"> <span class="skills-description" @click="skillInfo(skill)">{{skill?.name ?? ''}}</span> <span class="skills-equip">EQUIP</span></p>
            </div>
            <div class="item2">
                <span class="label-class"> DETAILS</span> <br>
                <div v-show="!!skillDetails?.name">
                <img class="cards-img" :src="`${cardsImg}`">
                <span class="skill-title">{{skillDetails?.name ?? ''}}</span>
                <span class="skill-mana">{{`${Math.abs(skillDetails?.cost ?? 0)}`}}</span>
                <span class="skill-damage">{{skillDetails?.target != 'self' ? Math.abs(skillDetails?.damage ?? 0) : 0}}</span>
                <span class="skill-heal">{{skillDetails?.target === 'self' ? Math.abs(skillDetails?.damage ?? 0) : 0}}</span>
                </div>
            </div>
            <div class="item3">
                <span class="label-class"> EQUIPPED (3 Skills Max)</span>
            </div>  
        </div>
         <!-- <div class="division">
             <div v-show="!!skillDetails?.name" class="arrangement">
                <span>{{`Name: `}}<span class="skill-text">{{skillDetails?.name ?? ''}}</span></span>
                <span>{{skillDetails?.target === 'self' ? 'Gain: ' : 'Damage: '}}<span>{{Math.abs(skillDetails?.damage ?? 0)}}</span></span>
                <span>{{`Target: `}}<span class="skill-text">{{skillDetails?.target ?? 0}}</span></span>
                <span>{{`Mana Cost: ${Math.abs(skillDetails?.cost ?? 0)}`}}</span>
            </div>
        </div> -->
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { ISkills } from "@/store/types";
    import { defineComponent, ref } from "vue";
    const cardsImg = require('../../../assets/skills/archer-arrowAssault.png');
    const cardslogo = require('../../../assets/skills/archer-arrowAssault-logo.png');

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
                cardsImg,
                cardslogo,
                skillInfo,
                skillDetails
			};
		}
	})
	export default SkillsScreen;
</script>
<style scoped>
	.skills-layout {
		background-repeat: no-repeat;
		background-size: cover;
		overflow: hidden !important;
		margin: auto;
        background:transparent;
        display: flex;
        flex-direction: row;
        margin-top:70px;
        height: 68%;
        width: 69%;
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
        margin-top: 30px;
    }
    p:hover {
        color: whitesmoke;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 5fr 3fr;
        height: inherit;
        width: inherit;
        border: 2px solid #5f330e;
    }
    .item1 {
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .grid-container > div {
        border: 2px solid #5f330e;
        font-size: 30px;
        text-align: left;
    }
    .label-class {
        color: white;
        margin-left: 8px;
        font-size: 17px;
    }
    .cards-img {
        height: 24%;
        position: absolute;
        left: 46%;
        top: 11%;
    }
    .logo-img {
        position: absolute;
        height: 5%;
        border: 2px solid white;
        border-radius: 5px;
    }
    .skills-class{
        cursor: pointer;
        text-decoration: none;
        margin-top: 10px;
        color: #5f330e;
        margin-left: 10px;
    }
    .skills-description{
        margin-left: 72px;
        font-size: 17px;
    }
    .skills-equip {
        color: #f5d06c;    
        position: absolute;
        left: 39%;
        font-size: 12px;
    }
    .skill-title {
        text-transform: uppercase;
        color: whitesmoke;
        top: 12.7%;
        left: 51%;
        font-size: 10px;
        position: absolute;
        text-align: center;
    }    
    .skill-mana {
       color: whitesmoke;
       top: 12%;
       left: 48%;
       font-size: 17px;
       position: absolute;
    }    
    .skill-damage {
       color: whitesmoke;
       top: 16.6%;
       left: 46.3%;
       font-size: 17px;
       position: absolute;
    }    
    .skill-heal {
       color: whitesmoke;
       top: 20.5%;
       left: 46.3%;
       font-size: 17px;
       position: absolute;
    }
</style>