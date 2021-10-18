<template>
	<div class="fight-result-screen" :style="`background-image:url(${(screenImage)});`">
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { defineComponent } from "vue";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/castle.gif');

	const FightResultScreen = defineComponent({
		props: [],
		data() {
			return {
				screenImage: screenGif,
			}
		},
		components: {},
		mounted() {},
		computed: {},
		methods: {},
		watch: {}
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