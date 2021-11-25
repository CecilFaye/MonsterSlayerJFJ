
<template>
	<div class="character-screen-layout"  :style="`background-image:url(${(screenImage)});`">
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
					<div class="grid-item">HEALTH</div>
					<div class="grid-item">MANA</div>  
					<div class="grid-item">EXP.</div>
					<div class="grid-item">NEXT LVL UP.</div>
					<div class="grid-item">{{ character.classTypeName}}</div>  
					<div class="grid-item">{{ character.stats["health"]}}</div>
					<div class="grid-item">{{ character.stats["mana"]}}</div>
					<div class="grid-item">{{ character.totalExp }}</div>
					<div class="grid-item">{{ character.nextLevelExp }}</div>
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
	import * as helper from "@/app-lib/services/session-helper";
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";

	const characterScreenImage = require('../../../assets/background/vuexie-characterLayout.jpg');
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
		height: 82%;
		width: 77%;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
		margin-top: 5%;
	}
	.info-container {
		background: transparent;
		height: 77%;
		width: 62.3%;
		position: absolute;
		top: 29.3%;
		left: 32.3%;
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
		grid-template-columns: 5fr 2fr 2fr 2fr 2fr;
		background-color: transparent;
		height: 65.3%;
		width: 91%;
		position: absolute;
		top: 18.83%;
		left: 4.9%;
	}
	.grid-item {
		background-color: transparent;
		text-align: center;
	}	
	.grid-itemLevel {
		text-align: center;	
		font-family: "AxieFont";
		color: #a4785c;
	}
</style>
