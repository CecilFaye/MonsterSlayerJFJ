
<template>
	<div class="fight-result-screen" :style="`background-image:url(${(screenImage)});`">
		<transition>
			<div v-show="isVictor" class="fight-result-layout center" :style="`background-image:url(${(overallBg)});`">
				<img :src="victoryImage" >
				<div>
					<span v-if="latestFightResult.lvlUp">LEVEL UP!</span><br>
					<span>Exp. Gain: {{latestFightResult.exp}}</span><br>
					<span v-if="latestFightResult.drop">Drop Gain: {{latestFightResult.drop}}</span><br>
					<span v-if="latestFightResult.newSkills?.length">
						New Skills: <br>
						<p class="skills-class" v-for="(skill, index) in latestFightResult.newSkills" :key="`skill-${index}`">{{skill ?? ''}}<br></p>
					</span>
					<span v-if="latestFightResult.unlockedDungeons?.length">
						Dungeon Unlocked: <br>
						<p class="skills-class" v-for="(dun, index) in latestFightResult.unlockedDungeons" :key="`dun-${index}`">{{dun ?? ''}}<br></p>
					</span>
				</div>
				<button class="btn2" @click="navigateToHome">Back To Main</button>
			</div>
		</transition>
		<transition>
			<div v-show="!isVictor" class="fight-result-layout center" :style="`background-image:url(${(overallBg)});`">
				<img class="img2" :src="defeatImage">
				<div>
					<span v-if="latestFightResult.lvlUp">LEVEL UP!</span><br>
					<span>Exp. Gain: {{latestFightResult.exp}}</span><br>
					<span v-if="latestFightResult.drop">Drop Gain: {{latestFightResult.drop}}</span><br>
					<span v-if="latestFightResult.newSkills?.length">
						New Skills: <br>
						<p class="skills-class" v-for="(skill, index) in latestFightResult.newSkills" :key="`skill-${index}`">{{skill ?? ''}}<br></p>
					</span>
					<span v-if="latestFightResult.unlockedDungeons?.length">
						Dungeon Unlocked: <br>
						<p class="skills-class" v-for="(dun, index) in latestFightResult.unlockedDungeons" :key="`dun-${index}`">{{dun ?? ''}}<br></p>
					</span>
				</div>
				<button class="btn3" @click="anotherGame">Retry?</button>
				<button class="btn4" @click="navigateToHome">Back To Main</button>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { computed, defineComponent } from "vue";
	import { useRouter } from "vue-router";
	import { mapMutations } from "vuex";

	const victoryImage = require('@/assets/background/victory.png');
	const defeatImage = require('@/assets/background/defeat.png');
	const overallBg = require('@/assets/background/login-bg.png');
	const gameRoute = `/game`;

	const FightResultScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const router = useRouter();
			const isVictor = computed(() =>  service.getWinner());
			const navigateToHome = () => {
				router.push(`${gameRoute}/mainstage`);
			};
			const anotherGame = () => {
				router.push(`${gameRoute}/transition`);
			};
			const latestFightResult = computed(() => {
				return service.getLatestFightResult();
			});
            return {
				victoryImage,
				defeatImage,
				overallBg,
				isVictor,
				navigateToHome,
				anotherGame,
				latestFightResult
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
	.center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
	img {
		width: inherit;
		margin-top: 10%;
	}

	.fight-result-layout {
		position: relative;
        height: 700px;
        width: 1250px;
        background: lightgray;
		background-repeat: no-repeat;
		background-size: cover;
        box-shadow: 0px 2px 15px 7px #2c8cdb;
	}

	.result-container {
		width: 100%;
		height: auto;
	}

	.result-container {
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