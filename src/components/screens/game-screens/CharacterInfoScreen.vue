
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
					<p class="parts-class" >
						<span class="sub-label">Armor:</span>
						<img v-if="!!equipment.armor?.name" class="item-img" :src="`${partsImg}`">
						<span
							v-bind:class="{ 'description-hover' : !!equipment.armor?.name }"
							@click="getInfo(equipment.armor)">{{equipment.armor?.name ?? ' ---'}}
						</span>
					</p>
					<p class="parts-class">
						<span class="sub-label">Weapon:</span>
						<img v-if="!!equipment.weapon?.name" class="item-img" :src="`${partsImg}`" >
						<span
							v-bind:class="{ 'description-hover' : !!equipment.weapon?.name }"
							@click="getInfo(equipment.weapon)">{{equipment.weapon?.name ?? ' ---'}}
						</span>
					</p>
				</div>
				<div class="skills">
					<div class="label">Skills</div>
					<p class="parts-class" v-for="(skill, index) in skills" :key="`skill-${index}`" >
						<img class="skill-img" :src="`${cardslogo}`" >
						<span
							v-bind:class="{ 'description-hover' : !!skill?.name }"
							@click="getInfo(skill)">{{skill?.name ?? ''}}
						</span>
					</p>
				</div>
			</div>
			<div class="information">
				<div class="label">Details</div>
				<div class="skills-container" v-show="showDetails && !isItem">
					<img class="cards-img" :src="`${cardsImg}`">
					<span class="skill-title">{{skillDetails?.name ?? ''}}</span>
					<span class="skill-mana">{{`${Math.abs(skillDetails?.cost ?? 0)}`}}</span>
					<span class="skill-damage">{{skillDetails?.target != 'self' ? Math.abs(skillDetails?.damage ?? 0) : '0'}}</span>
					<span class="skill-heal">{{skillDetails?.target === 'self' ? Math.abs(skillDetails?.damage ?? 0) : '0'}}</span>
					<span class="skill-target">{{`Target: ${skillDetails?.target ?? ''}`}}</span>
					<span class="skill-type">{{`Type: ${skillDetails?.type ? skillTypeName(skillDetails?.type) : ''}`}}</span>
				</div>
				<div class="equipment-container" v-show="showDetails && isItem">
					<span class="sub-label"  >{{`Name: `}}</span>{{itemDetails?.name ?? ''}}<br>
					<span  class="sub-label">{{`Type: `}}</span>{{itemType}} <br>
					<span  class="sub-label">{{`Class: `}}</span>{{itemClass}}
					<div v-bind:style="{paddingTop: '0.5rem'}">
						<span  class="label">STATS BONUS</span>
						<p v-for="(stat, index) in Object.keys(itemDetails?.bonus ?? [])" :key="`stat-${index}`">
							<span class="sub-label">{{`${stat}: `}}</span>
							{{`${Math.abs(itemDetails?.bonus[stat] ?? 0)}`}}
						</p>
					</div>
				</div>
				<div class="default-display" v-show="!showDetails">
					<p>Click Equipment or Skill to show details.</p>
				</div>
			</div>
        </div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { IItem, ISkills } from "@/store/types";
	import { computed, defineComponent, ref } from "vue";

	const partsImg = require('@/assets/inventory/sampleParts.png');
	const cardsImg = require('@/assets/skills/archer-arrowAssault.png');
	const cardslogo = require('@/assets/skills/archer-arrowAssault-logo.png');
	const CharacterInfoScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const character = service.getCharacterDetails();
			const itemDetails = ref<IItem>(null);
			const skillDetails = ref<ISkills>(null);
			const isItemClicked = ref<boolean>(true);
			const isClicked = ref<boolean>(false);
			const stats = computed(() => {
				return service.getCharacterStats();
			});
			const equipment = computed(() => {
				return service.getCharacterEquipment();
			});
			const getInfo = (item: IItem | ISkills): void => {
				// eslint-disable-next-line no-prototype-builtins
				if (item?.hasOwnProperty('bonus')) {
					itemDetails.value = {...item} as IItem;
					isItemClicked.value = true;
				} else {
					isItemClicked.value = false;
					skillDetails.value = {...item} as ISkills;
				}
				isClicked.value = true;
            };
			const itemType = computed((): string => {
                const type = itemDetails.value?.type;
                if (type) {
                    return itemDetails.value.type.toUpperCase() === 'WPN' ? 'Weapon' : 'Armor';
                } else {
                    return '';
                }
            });
			const itemClass = computed((): string => {
                return service.getCharacterTypeName(itemDetails.value?.classId ?? 0)
            });
			const skills = computed(() => {
				return service.getCharacterSkills();
			});

			const showDetails = computed(() => {
				return isClicked.value;
			});
			const isItem = computed(() => {
				return isItemClicked.value;
			});

			const skillTypeName = (type: string): string => service.skillTypeName(type);

			return {
				character,
				stats,
				equipment,
				skills,
				partsImg,
				cardslogo,
				cardsImg,
				skillDetails,
				itemDetails,
				showDetails,
				isItem,
				itemType,
				itemClass,
				getInfo,
				skillTypeName
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
	.equipment-container, .skills-container, p {
		padding: 0;
		margin: 0.3em;
		color: #5f330e;
	}
	.skills-container, .equipment-container {
		text-align: center;
	}
	.equipment-container, .skills-container, .default-display {
		margin-top: 1rem;
	}

	.default-display {
		text-align: center;
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
        text-decoration: none;
        color: #5f330e;
    }
    .parts-description{
        font-size: 17px;
    }
	.description-hover:hover {
		color: rgb(245, 201, 79);
		cursor: pointer;
	}
    .item-img {
		height: 10%;
		width: 15%;
		vertical-align: middle;
    }
	.item-text {
        text-transform: uppercase;
        color: whitesmoke;
    }
	.skill-img {
		height: 20px;
		width: 20px;
		vertical-align: middle;
		margin: 0 1rem;
		border: 1px solid white;
        border-radius: 5px
    }
	.cards-img {
        height: 63%;
        width: 63%;
    }
	.sub-label {
		text-transform: uppercase;
		font-weight: bold;
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
		font-weight: 900;
		top: 70%;
		left: 69%;
		font-size: 10px;
		position: absolute;
		text-align: center;
		width: 95px;
    }
    .skill-mana {
		color: rgb(0, 0, 177);
		top: 69%;
		left: 63%;
		font-size: 17px;
		position: absolute;
		font-weight: 900;
		width: 31px;
		text-align: center;
    }
    .skill-damage {
		color: red;
		font-weight: 900;
		top: 78.8%;
		left: 60%;
		font-size: 17px;
		position: absolute;
		width: 35px;
		text-align: center;
    }
    .skill-heal {
		color: rgb(28, 172, 71);
		font-weight: 900;
		top: 87.9%;
		left: 27.2rem;
		font-size: 17px;
		position: absolute;
		width: 35px;
		text-align: center;
    }
	.skill-target, .skill-type {
		color: whitesmoke;
		top: 107%;
		left: 30rem;
		position: absolute;
		text-transform: capitalize;
    }

	.skill-type {
		color: whitesmoke;
		top: 111%;
		left: 30rem;
		position: absolute;
		text-transform: capitalize;
    }
</style>
