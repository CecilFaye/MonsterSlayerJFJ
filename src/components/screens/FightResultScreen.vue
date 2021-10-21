<template>
	<div class="fight-result-screen" :style="`background-image:url(${(screenImage)});`">
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import { defineComponent } from "vue";
	import { useStore } from "vuex";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/castle.gif');

	const FightResultScreen = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();
            return {

			}
        }
	})
	export default FightResultScreen;
</script>


<style scoped>
	.fight-result-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
	}
</style>