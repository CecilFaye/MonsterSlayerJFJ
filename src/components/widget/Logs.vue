<template>
	<!-- <div class="logs-container" v-show="battleStart"> -->
	<div class="logs-container">
      <p v-for="(log, index) in logs" class='log' :key="`log-${index}`">{{log}}</p>
    </div>
</template>

<script lang="ts">

	import { useStore } from "vuex";
    import { computed, defineComponent } from "vue";

	const LogsWidget = defineComponent({
		props: [],
		setup() {
			const store = useStore();
			const battleStart = computed(() => {
				return store.state.game.battleStart;
			});
			const logs = computed(() => {
				const fightLogs = store.state.game.fightLogs;
				const logToShow = fightLogs.length > 4 ? fightLogs.slice(0, 4) : fightLogs;
				return logToShow;
			});
            return {
                logs,battleStart
			}
        }
	})
	export default LogsWidget;
</script>
<style scoped>
	p {
		margin: 5px;
		min-width: 100px;
		min-height: 2rem;
		font-size: 1rem;
		font-weight: 800;
		display: block;
		color: whitesmoke;
	}
	p:nth-of-type(3n+0) {
		opacity: 0.2;
	}
	p:nth-of-type(4n+0) {
		opacity: 0.1;
	}
	.logs-container {
		margin: 1rem;
		white-space: normal;
		overflow: hidden;
		height: 89%;
		width: 96%;
	}
</style>
