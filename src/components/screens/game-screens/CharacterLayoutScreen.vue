
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
				<span class="character-class">{{ character.classTypeName }} </span>
				<span class="character-level">Lv.{{ character.level }} </span>
				<span class="character-name">{{ character.name }}</span>
			</div>
			<button class="battle-button" @click="navigateToRoute('battle')">Battle</button>
			<button class="logout-button" @click="logout">Logout</button>
		</div>
		<div>
			<div class="character-info">
				<div class="grid-container">
					<div class="grid-itemLevel">Level {{ character.level}}</div>
					<div class="grid-itemTitle">HEALTH</div>
					<div class="grid-itemTitle">MANA</div>
					<div class="grid-itemTitle">EXP.</div>
					<div class="grid-itemTitle">NEXT LVL UP.</div>
					<div class="grid-item"><span class="class-type">{{ character.classTypeName }}</span></div>
					<div class="grid-item"><img class="icon-img" :src="`${healthImage}`"><span class="info-class">{{ character.stats["health"]}}</span></div>
					<div class="grid-item"><img class="icon-img" :src="`${manaImage}`"><span class="info-class">{{ character.stats["mana"]}}</span></div>
					<div class="grid-item"><img class="icon-img" :src="`${expImage}`"><span class="info-class">{{ character.totalExp }}</span></div>
					<div class="grid-item"><img class="icon-img" :src="`${nxtLvlImage}`"><span class="info-class">{{ character.nextLevelExp }}</span></div>
				</div>
			</div>
			<div class="info-container">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import { defineComponent, onBeforeMount, computed } from "vue";
	import { useRouter } from "vue-router";
	import * as helper from "@/app-lib/helper/session-helper";
	import useMonsterSlayerService from "@/services/monster-slayer-service";

	const characterScreenImage = require('../../../assets/background/vuexie-characterLayout.jpg');
	const characterImage =  require('@/assets/hero/playerAqua-idle.gif');
	const healthImage =  require('@/assets/skills/healthIcon.jpg');
	const manaImage =  require('@/assets/skills/manaIcon.jpg');
	const expImage =  require('@/assets/skills/expIcon.jpg');
	const nxtLvlImage =  require('@/assets/skills/nextLvlIcon.jpg');

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
			const stats = computed(() => {
				const character = service.getCharacterDetails();
				return Object.keys(character.stats).map(key => Object.assign({}, { key, value: character.stats[key] }));
			});
			onBeforeMount(() => {
				service.initFromSession();
			});
			return {
				screenImage,
				characterImage,
				healthImage,
				manaImage,
				expImage,
				nxtLvlImage,
				character,
				stats,
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
		height: 107%;
		width: 67.3%;
		position: absolute;
		top: 29.3%;
		left: 34%;

	}
	.character-info {
		background: transparent;
		height: 8.3%;
		width: 33.3%;
		position: absolute;
		top: 26.83%;
		left: 43.9%;
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
		top: 9.6%;
		left: 11.1%;
		position: absolute;
		min-width: 135px;
		min-height: 135px;
		background-color: transparent;
		border: transparent;
		color: transparent;
		box-shadow: none;
	}
	.axieImg {
		height:450px;
	}
	.axie-side {
		text-align: center;
		top: 21%;
		left: 13%;
		position: absolute;
	}
	.character-name {
		font-size: 26px;
		font-weight: 400;
		position: absolute;
		left: 34%;
		top: 114%;
		font-family: "AxieFont";
		color: white;
	}
	.character-class {
		font-size: 20px;
		font-weight: 400;
		position: absolute;
		left: 32.5%;
		top: 91%;
		font-family: "AxieFont";
		color: white;
	}
	.character-level {
		font-size: 26px;
		font-weight: 400;
		position: absolute;
		left: 49%;
		top: 90%;
		font-family: "AxieFont";
		color: lawngreen;
	}
	.grid-container
	{
		display: grid;
		grid-template-columns: 4fr 2fr 2fr 2fr 2.5fr;
		background-color: transparent;
		height: 65.3%;
		width: 91%;
		position: absolute;
		top: 18.83%;
		left: 4.9%;
	}
	.grid-item {
		text-align: left;
	}
	.grid-itemTitle {
		text-align: center;
		color: #a4785c;
		font-weight: 900;
		color: #a4785c;
		font-size: 14px;
		margin-top: -2px;
	}
	.grid-itemLevel {
		font-weight: 900;
		color: #a4785c;
		text-align: left;
		margin-top: -10px;
		margin-left: 19px;
		font-size: 22px;
	}
	.icon-img {
		font-weight: 1px;
		height: 32px;
		padding-right: 7px;
		margin-left: 16px;
	}
	.info-class {
		color: #5f330e;
		font-weight: 900;
		position: absolute;
		margin-top: 4px;
	}
	.class-type {
		color: #5f330e;
		font-family: "AxieFont";
		text-transform: uppercase;
		font-size: 20px;
		position: absolute;
		margin-top: -5px;
		left: 9%;
	}
</style>
