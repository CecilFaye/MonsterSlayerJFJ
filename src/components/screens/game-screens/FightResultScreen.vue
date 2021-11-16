
<template>
	<div class="fight-result-screen" :style="`background-image:url(${(screenImage)});`">
		<transition>
			<div v-show="isVictor" class="result-container"  >
				<img :src="victoryGif" >
				<button class="btn1" @click="anotherGame">Play Again!</button>
				<button class="btn2" @click="navigateToHome">Back To Character Information</button>
			</div>
		</transition>
		<transition>
			<div v-show="!isVictor" class="result-container" >
				<img class="img2" :src="gameOverGif">
				<button class="btn3" @click="anotherGame">Play Again!</button>
				<button class="btn4" @click="navigateToHome">Back To Character Information</button>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import { computed, defineComponent } from "vue";
	import { useRouter } from "vue-router";
	import { mapMutations } from "vuex";

	const gameOverGif = require('@/assets/background/GameOver2.gif');
	const victoryGif = require('@/assets/background/YouWin2.gif');
	const gameRoute = `/game`;

	const FightResultScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const router = useRouter();
			const isVictor = computed(() =>  service.getWinner());
			const navigateToHome = () => {
				router.push(`${gameRoute}/character`);
			};
			const anotherGame = () => {
				router.push(`${gameRoute}/battle`);
			};
            return {
				gameOverGif,
				victoryGif,
				isVictor,
				navigateToHome,
				anotherGame
			}
        },
		methods: {
			...mapMutations({
				changeScreen: 'game/changeScreen'
			})
		}
	})
	export default FightResultScreen;
</script>


<style scoped>
	button {
		cursor: pointer;
	}
	.fight-result-screen {
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
		height: 100vh;
	}

	.result-container img {
		width: 100%;
		height: auto;
	}

	.result-container .img2 {
		height: 100vh;
	}

	.result-container {
		position: relative;
	}

	.btn1, .btn2, .btn3, .btn4 {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		background-color: #555;
		color: white;
		font-size: 16px;
		padding: 12px 24px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
		text-align: center;
		width: 200px;
		text-transform: uppercase;
		font-weight: 900;
	}
	.btn1 {
		top: 75%;
	}

	.btn2 {
		top: 82%;
	}

	.btn3 {
		top: 80%;
	}

	.btn4 {
		top: 89%;
	}
</style>