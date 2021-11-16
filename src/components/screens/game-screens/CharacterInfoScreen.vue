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
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import { computed, defineComponent, onBeforeMount } from "vue";
import { useStore } from "vuex";

	const CharacterInfoScreen = defineComponent({
		setup() {
			const store = useStore();
			const service = useMonsterSlayerService();
			const character = computed(() => service.getCharacterDetails());
			const stats = computed(() => {
				const character = store.state.game.character;
				return Object.keys(character.stats).map(key => Object.assign({}, { key, value: character.stats[key] }));
			});
			onBeforeMount(() => {
				store.commit('game/initFromSession');
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
