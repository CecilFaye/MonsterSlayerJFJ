<template>
	<div class="mana-bar-container">
        <div id="mana-bar"></div>
    </div>
</template>
<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { defineComponent } from "vue";
    import { useStore } from "vuex";

	const ManaBarWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();
            return {

			}
        }
	})
	export default ManaBarWidget;
</script>
<style scoped>

</style>