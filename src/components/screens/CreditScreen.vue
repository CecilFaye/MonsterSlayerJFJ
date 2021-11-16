<template>
	<div class="credit-screen" :style="`background-image:url(${(screenImage)});`">
		<div class="childB">
			<div class="developers-side">
				<button class="devButton">
				<img :src="`${fayeImg}`">
				</button>
				<button class="devButton">
				<img :src="`${jhennesonImg}`">
				</button>
				<button class="devButton">
				<img :src="`${joshuaImg}`">
				</button>
			</div>
			<div class="home-screen-options">
			<div class="home-screen-option" @click="returnHome()">
				Back to Home Page
			</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
import { useRouter } from "vue-router";
	import { mapMutations } from "vuex";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenBG = require('../../assets/background/vuexie-credits-v2.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const bookPng = require('../../assets/background/wizard-book.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const vuezardImg = require('../../assets/background/wizard-pic.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fayeImg = require('../../assets/background/faye-vuexie.jpg');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const jhennesonImg = require('../../assets/background/jhenesson-vuexie.jpg');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const joshuaImg = require('../../assets/background/joshua-vuexie.jpg');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const sampleGif = require('../../assets/background/faye-gift.gif');

	const CreditScreen = defineComponent({
		props: [],
		setup() {
			const router = useRouter();
			const returnHome = ():void => {
				router.push('/');
			};
			return {
				returnHome
			}
		},
		data() {
			return {
				screenImage: screenBG,
				bookPng, vuezardImg,fayeImg
				,jhennesonImg,joshuaImg, sampleGif
			}
		},
		methods: {
			...mapMutations({
				changeScreen: 'game/changeScreen'
			})
		}
	})
	export default CreditScreen;
</script>

<style scoped>
	.credit-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		text-align: center;
		overflow: hidden !important;
	}
	.childA{
		float:left;
		width:40%;
		height:100vh;
		position:absolute;
	}
	.childB {
		float:right;
		width:60%;
		height:100vh;
	}
	.credit-screen .bookBackground {
		margin-top:-40px;
	}
	.credit-screen p {
		position: absolute;
		width:200%;
		text-align: start;
	}
	.credit-screen .title {
		font-weight: bold;
		font-size: 20px;
	}
	.credit-screen .btn {
		position: absolute;
		top: 30%;
		left:50%;
		font-size: 16px;
		border: none;
		cursor: pointer;
		font-family:cursive;
		}

	.credit-screen .story {
		position: absolute;
		top: 25%;
		left:34%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		color: black;
		font-size: 16px;
		padding: 12px 24px;
		font-family:cursive;
	}
		.credit-screen .developers {
		position: absolute;
		top: 42%;
		left: 60%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		color: black;
		font-size: 16px;
		padding: 12px 24px;
		font-family:cursive;
	}

	.credit-screen .displayPicture {
		height: 90px;
		margin-top:15px;
	}

	.axie-side {
		text-align: center;
		top: 32%;
		left: 24%;
		position: absolute;
	}

	.developers-side {
		text-align: center;
		top: 35%;
		left: 32%;
		position: absolute;
	}
	.axieImg {
		height:350px;
	}

	.devButton {
		border: none;
		cursor: pointer;
		margin:30px;
		}


	.home-screen-options {
		margin: 215px auto 0 auto;
		width: 20%;
		cursor: pointer;
		top: 60%;
		left: 67%;
		position: absolute;
	}

	.home-screen-option {
		border: 2px solid #183640;
		color: #183640;
		padding: 8px;
		font-size: 19px;
		font-weight: 800;
		margin: 35px;
	}

	.devName {
		font-family: "AxieFont";
		font-size: 40px;
		color: #6fd9d7;
		text-shadow: 3px 0 0 #183640, 0 -3px 0 #183640, 0 3px 0 #183640, -3px 0 0 #183640;
		}

</style>
