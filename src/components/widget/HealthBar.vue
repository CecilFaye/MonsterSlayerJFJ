<template>
	<div class="health-bar-container">
        <div id="health-bar"></div>
    </div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";

	const HealthBarWidget = defineComponent({
		props: [],
		setup() {

            // Properties
            const service = useMonsterSlayerService();
			const store = useStore();

            // Computed
			const actionSkills = computed(() => store.state.game.currentScreen);
            return {

			}
        }
	})
	export default HealthBarWidget;
</script>
<style scoped>

</style>