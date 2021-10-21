
<template>
	<div class="logs-container">
        <label v-for="(log, index) in logs" class='log' :key="`log-${index}`">{{ log }}</label>
    </div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { useStore } from "vuex";
	import { defineComponent } from "vue";

	const LogsWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();
            return {

			}
        }
	})
	export default LogsWidget;
</script>
<style scoped>

</style>
