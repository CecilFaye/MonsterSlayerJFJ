<template>
	<div class="logs-container">
      <p v-for="(log, index) in logs.slice().reverse()" class='log' :key="`log-${index}`">{{log}}</p>
    </div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { useStore } from "vuex";
	import { computed, defineComponent } from "vue";

	const LogsWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();
			const logs = computed(() =>store.state.game.fightLogs);
            return {
                logs
			}
        }
	})
	export default LogsWidget;
</script>
<style scoped>
 .logs-container {
        width: 50%;
		margin: 1rem;
		background: white;
		white-space: normal;
	}
</style>
