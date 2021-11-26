<template>
	<div class="character-layout">
        <div class="header-stat">
            <p>Level: {{` ${character.level}`}}</p>
			<p>Class: {{` ${character.classTypeName}`}}</p>
			<p>Total Exp.: {{` ${character.totalExp}`}}</p>
			<p>Next Level Exp.: {{` ${character.nextLevelExp}`}}</p>
        </div>
		<div>
            <p v-for="(stat, index) in stats" class='log' :key="`stat-${index}`">{{`${stat.key}: ${stat.value}`}}</p>
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
		height: inherit;
		width: inherit;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
        display: flex;
        background: transparent;
		flex-direction: column;
	}
	p {
		font-size: 20px;
		font-weight: 800;
	}
	.header-stat {
		padding: 10px 0;
	}
</style>
