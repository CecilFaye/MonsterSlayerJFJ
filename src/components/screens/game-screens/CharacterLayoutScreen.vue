
<template>
	<div class="character-screen-layout center"  >
		<div class="bg" :style="`background-image:url(${(screenImage)});`">
			<div class="menu-bar">
				<button @click="navigateToRoute('character')">Character</button>
				<button @click="navigateToRoute('skills')">Skills</button>
				<button @click="navigateToRoute('inventory')">Inventory</button>

			</div>
			<div class="character-image">
				<div class="axie-side">
					<img class="axieImg" :src="`${characterImage}`">
					<span class="character-name">{{ character.name }}</span>
				</div>
				<button class="battle-button" @click="navigateToRoute('battle')">Battle</button>
				<button class="logout-button" @click="logout">Logout</button>
			</div>
			<div class="info-container">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import { defineComponent, onBeforeMount } from "vue";
	import { useRouter } from "vue-router";
	import * as helper from "@/app-lib/helper/session-helper";
	import useMonsterSlayerService from "@/services/monster-slayer-service";

	const characterScreenImage = require('../../../assets/background/vuexie-info-main.png');
	const characterImage =  require('@/assets/hero/playerAqua-idle.gif');

	const CharacterLayoutScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const router = useRouter();
			const screenImage = characterScreenImage;
			const gameRoute = `/game`;
			const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`);
			};
			const logout = () => {
				helper.clearAllSessionValues();
				setTimeout(() => router.push('/'), 1000);
			};
			const character = service.getCharacterDetails();
			onBeforeMount(() => {
				service.initFromSession();
			});
			return {
				screenImage,
				characterImage,
				character,
				navigateToRoute,
				logout
			};
		}
	})
	export default CharacterLayoutScreen;
</script>
<style scoped>
	.character-screen-layout {
		/* height: 82%;
		width: 77%;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
		margin-top: 5%; */
		position: relative;
        height: 700px;
        width: 1250px;
        background: lightgray;
        box-shadow: 0px 2px 15px 7px #2c8cdb;
	}
	.center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

	.bg {
        display: flex;
        flex-direction: row;

        /* Full height */
        height: inherit;

        /* Center and scale the image nicely */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        z-index: -1;
    }

	.info-container {
		background: transparent;
		height: 77%;
		width: 62.3%;
		position: absolute;
		top: 23.3%;
		left: 32.3%;
	}
	.menu-bar {
		position: absolute;
		top: 17%;
		left: 42.5%;
	}
	button {
		margin: 5px;
		min-width: 100px;
		min-height: 2rem;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		padding: 0.7rem;
		text-transform: uppercase;
        box-shadow: 0px 4px 5px #7c797933;
        border-radius: 10px;
		background-color: rgb(185, 105, 48);
		color: whitesmoke;
	}
	.logout-button {
		top: 11%;
		left: 82.2%;
		position: absolute;
	}
	.battle-button {
		top: 11%;
		left: 12.1%;
		position: absolute;
	}
	.axieImg {
		height:350px;
	}
	.axie-side {
		text-align: center;
		top: 33%;
		left: 16%;
		position: absolute;
	}
	.character-name {
		font-size: 20px;
		font-weight: 800;
		text-transform: uppercase;
		position: absolute;
		left: 32%;
		top: 108%;
	}
</style>
