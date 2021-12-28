<template>
	<div class="character-layout">
		<div class="stat-container quick-border">
			<div class="label">Character Stat</div>
			<div class="stat-division">
				<div class="values">
					<span class="label">Attribute</span>
					<p style="text-transform: uppercase; font-weight: bold;" v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.key}}</p>
				</div>
				<div class="values">
					<span class="label">Base</span>
					<p v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.value}}</p>
				</div>
				<div class="values">
					<span class="label">Bonus</span>
					<p v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.value}}</p>
				</div>
				<div class="values">
					<span class="label">Total</span>
					<p v-for="(stat, index) in stats" :key="`stat-${index}`">{{stat.value}}</p>
				</div>
			</div>
		</div>
		<div class="other-container">
			<div class="equip-skills">
				<div class="equipments">
					<div class="label">Equipments</div>
				</div>
				<div class="skills">
					<div class="label">Skills</div>
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
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { computed, defineComponent } from "vue";

	const CharacterInfoScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const character = service.getCharacterDetails();
			const stats = computed(() => {
				const character = service.getCharacterDetails();
				return Object.keys(character.stats).map(key => Object.assign({}, { key, value: character.stats[key] }));
			});
			return {
				character,
				stats
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
	.label {
		text-align: center;
		margin: auto;
		width: 100%;
		font-weight: 900;
		text-transform: uppercase;
		color:saddlebrown;
		font-family: "AxieFont";
	}
</style>
