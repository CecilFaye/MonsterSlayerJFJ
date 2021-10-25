<template>
	<div class="credit-screen" :style="`background-image:url(${(screenImage)});`">
		<img class="bookBackground" style="z-index: 10000 !important;"  :src="`${bookPng}`">
		<div class="story">
			<p class="title">Life  of a Vuezard</p><br><br><br>
			<img class="displayPicture" style="z-index: 10000 !important;"  :src="`${vuezardImg}`"> <br>
			<p>Vuezard<br><br>From the kindly old white bearded casters wearing robes with stars and moons to the battle-hardened  war-mage throwing fireballs at monsters. The royal family has always had one on hand: a wise diviner to lead  the kingdom into peace or a dangerous conjurer to dominate all of  the land under one rule. Or perhaps a divine helear? An alchemist? Or even a necromancer?<br><br> The combinations are boundless. <br><br>Let me tell you my story.</p>
		</div>

		<div class="developers">
			<p class="title">DEVELOPERS</p><br><br><br>
			<img class="displayPicture" style="z-index: 10000 !important;"  :src="`${fayeImg}`"> <br>
			<label> Faye Clemente </label><br><br>
			<img class="displayPicture" style="z-index: 10000 !important;"  :src="`${jhennesonImg}`"><br>
			<label>Jhenneson Torayno </label><br><br>
			<img class="displayPicture" style="z-index: 10000 !important;"  :src="`${joshuaImg}`"> <br>
			<label> Joshua Silvestre</label>
		</div>

		<button class="btn" @click="changeScreen('homeScreen')">
			Back to Home Screen
		</button>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { mapMutations } from "vuex";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const screenGif = require('../../assets/background/castle.gif');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const bookPng = require('../../assets/background/wizard-book.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const vuezardImg = require('../../assets/background/wizard-pic.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fayeImg = require('../../assets/background/faye.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const jhennesonImg = require('../../assets/background/jhenneson.png');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const joshuaImg = require('../../assets/background/joshua.png');

	const CreditScreen = defineComponent({
		props: [],
		data() {
			return {
				screenImage: screenGif,
				bookPng, vuezardImg,fayeImg
				,jhennesonImg,joshuaImg
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
		overflow:hidden;
		text-align: center;
		position: relative;
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
		top: 80%;
		left: 65%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		background-color: #555;
		color: white;
		font-size: 16px;
		padding: 12px 24px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
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

</style>
