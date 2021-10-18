
<template>
	<div class="game-screen" :style="`background-image:url(${(screenImage)});`">
		<div class="main-container">
			<div class="player">
				<div class="group-container">
					<label>Player</label>
					<div class="health-bar">
						<div id="playerHealthBar" class="inner-health-bar"></div>
					</div>
				</div>
				<Player class="player"/>
			</div>
			<div class="monster">
				<div class="group-container">
					<label>Player</label>
					<div class="health-bar">
						<div id="playerHealthBar" class="inner-health-bar"></div>
					</div>
				</div>
				<Monster class="monster"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import { defineComponent } from "vue";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/castle.gif');

	const GameScreen = defineComponent({
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
	export default GameScreen;
</script>

<style scoped>
	.game-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
	}

	.player {
		float: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.monster {
		float: right;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>