
<template>
	<div class="character-layout">
		<div class="stat-container quick-border">
			<div class="label">Character Stat</div>
			<div class="stat-division">
				<div class="values">
					<span class="label">Attribute</span>
					<p class="sub-label" v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.key}}</p>
				</div>
				<div class="values">
					<span class="label">Base</span>
					<p v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.base}}</p>
				</div>
				<div class="values">
					<span class="label">Bonus</span>
					<p class="bonus" v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.bonus}}</p>
				</div>
				<div class="values">
					<span class="label">Total</span>
					<p v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.total}}</p>
				</div>
			</div>
		</div>
		<div class="other-container">
			<div class="equip-skills">
				<div class="equipments">
					<div class="label">Equipments</div>
					<p class="parts-class" @click="getInfo(equipment.armor)">
						<span class="sub-label">Armor:</span>
						<img class="item-img" :src="`${partsImg}`">
						{{equipment.armor?.name ?? ''}}
					</p>
					<p class="parts-class" @click="getInfo(equipment.weapon)">
						<span class="sub-label">Weapon:</span>
						<img class="item-img" :src="`${partsImg}`" >
						{{equipment.weapon?.name ?? ''}}
					</p>
				</div>
				<div class="skills">
					<div class="label">Skills</div>
					<p class="parts-class" v-for="(skill, index) in skills" :key="`skill-${index}`" @click="getInfo(skill)">
						<img class="skill-img" :src="`${cardslogo}`" >
						{{skill?.name ?? ''}}
					</p>
				</div>
			</div>
			<div class="information">
				<div class="label">Information</div>
				<p style="text-transform: uppercase; font-weight: bold;" v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.key}}</p>
			</div>
        </div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { IItem } from "@/store/types";
	import { computed, defineComponent, ref } from "vue";

	const partsImg = require('@/assets/inventory/sampleParts.png');
	const cardslogo = require('@/assets/skills/archer-arrowAssault-logo.png');
	const CharacterInfoScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const character = service.getCharacterDetails();
			const dataDetails = ref<IItem>();
			const stats = computed(() => {
				return service.getCharacterStats();
			});
			const equipment = computed(() => {
				return service.getCharacterEquipment();
			});
			const getInfo = (item: IItem): void => {
                dataDetails.value = {...item};
            };
			const skills = computed(() => {
				return service.getCharacterSkills();
			})
			return {
				character,
				stats,
				equipment,
				skills,
				partsImg,
				cardslogo,
				getInfo
			};
		}
	})
	export default CharacterInfoScreen;
</script>
<style scoped>
	.character-layout {
		margin: auto;
        background:transparent;
		border: 4px solid #5f330e;
	}
	p {
		padding: 0;
		margin: 0.5em;
		color: #5f330e;
	}
	.stat-container {
		display: grid;
        grid-template-rows: 1fr 4fr;
		height: 17em;
		width: inherit;
	}
	.stat-division {
		display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
	}
	.stat-division > .values {
		text-align: center;
	}
	.other-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 20em;
        width: inherit;
		border-top: 4px solid #5f330e;
    }
	.other-container .label {
		margin: 5px 0px;
	}
	.equip-skills {
		display: grid;
		grid-template-rows: 1fr 1.3fr;
	}
	.information {
		border-left: 4px solid #5f330e;
	}
	.equipments {
		border-bottom: 2px solid #5f330e;
	}
	.skills {
		border-top: 2px solid #5f330e;
	}
	.bonus {
		color:rgb(13, 66, 36);
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
	.parts-class{
        cursor: pointer;
        text-decoration: none;
        color: #5f330e;
    }
    .parts-description{
        font-size: 17px;
    }
    .item-img {
		height: 10%;
		width: 15%;
		vertical-align: middle;
    }
	.skill-img {
		height: 20px;
		width: 20px;
		vertical-align: middle;
		margin: 0 1rem;
		border: 1px solid white;
        border-radius: 5px
    }
	.sub-label {
		text-transform: uppercase;
		font-weight: bold;
	}
</style>
