
<template>
	<div class="logs-container">
        <label v-for="(log, index) in logs" class='log' :key="`log-${index}`">{{ log }}</label>
    </div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { useStore } from "vuex";
	import { defineComponent, computed } from "vue";

	const LogsWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();
            
			const logs = computed(() => {
				const fightLogs = store.getters['game/getFightLogs'];
				const logToShow = fightLogs.length > 4 ? fightLogs.slice(0, 4) : fightLogs;
				console.log(fightLogs.length);
				console.log(logToShow);
				return logToShow;
			});

			return {
				logs
			};
        }
	})
	export default LogsWidget;
</script>
<style scoped>
	label {
		margin: 5px;
		min-width: 100px;
		min-height: 2rem;
		font-size: 1rem;
		font-weight: 800;
		text-transform: uppercase;
		display: block;
		text-align: center;
		color: white;
	}
	label:nth-of-type(3n+0), label:nth-of-type(4n+0) {
		opacity: 0.2;
	}
	.logs-container {
        width: 50%;
		max-width: 50%;
		margin: 1rem;
	}
</style>
