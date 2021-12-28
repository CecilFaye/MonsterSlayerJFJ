
<template>
	<div class="character-screen-layout center"  >
		<div class="bg" :style="`background-image:url(${(screenImage)});`">
			<button class="back-button" @click="navigateToMain"></button>
			<button class="previous-button" @click="navigate('prev')"></button>
			<div class="page-name">
				<span >{{currentRoute}}</span>
			</div>
			<button class="next-button" @click="navigate('next')"></button>
			<div class="character-image">
				<div class="axie-side">
					<img class="axieImg" :src="`${characterImage}`">
					<div class="character-class">
						<span>{{ character.classTypeName }}</span>
						<span class="character-level">Lv.{{ character.level }} </span>
					</div>
					<span class="character-name">{{ character.name }}</span>
				</div>
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
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import { defineComponent, onBeforeMount, computed, ref } from "vue";
	import { useRouter } from "vue-router";
	import * as helper from "@/app-lib/helper/session-helper";
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { navArrangement } from "@/app-lib/constant/app-config"

	const characterScreenImage = require('@/assets/background/vuexie-character-layout.jpg');
	const characterImage =  require('@/assets/hero/playerAqua-idle.gif');
	const healthImage =  require('@/assets/skills/healthIcon.jpg');
	const manaImage =  require('@/assets/skills/manaIcon.jpg');
	const expImage =  require('@/assets/skills/expIcon.jpg');
	const nxtLvlImage =  require('@/assets/skills/nextLvlIcon.jpg');

	const CharacterLayoutScreen = defineComponent({
		setup() {
			const service = useMonsterSlayerService();
			const router = useRouter();
			const keys = Object.keys(navArrangement);
			const currentRoute = ref<string>(keys.find(k => router.currentRoute.value?.name?.toString().includes(k)));
			const screenImage = characterScreenImage;
			const gameRoute = `/game`;
			const navigate = (name: string) => {
				let next = 0;
				if (name === 'prev') {
					next = navArrangement[currentRoute.value] - 1;
				} else {
					next = navArrangement[currentRoute.value] + 1;
				}
				if (next < 0) {
					next = 2;
				} else if (next >= keys.length) {
					next = 0;
				}
				const routeName = keys.find((k, i) => i === next);
				currentRoute.value = routeName;
				router.push(`${gameRoute}/${routeName}`);
			};
			const navigateToMain = () => {
				router.push(`/mainstage`);
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
				currentRoute,
				navigate,
				navigateToMain,
				logout
			};
		}
	})
	export default CharacterLayoutScreen;
</script>
<style scoped>
	.character-screen-layout {
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
		height: 52.5%;
		width: 43.3%;
		position: absolute;
		top: 27.3%;
		left: 42%;
	}
	.character-info {
		background: transparent;
		height: 8.3%;
		width: 43.3%;
		position: absolute;
		top: 17%;
		left: 42%;
	}
	button {
		margin: 5px;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		padding: 0.7rem;
		text-transform: uppercase;
        /* box-shadow: 0px 4px 5px #7c797933; */
        border-radius: 10px;
		background-color: rgb(185, 105, 48);
		z-index: 1;
		cursor: pointer;
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
		z-index: -1;
	}
	.axie-side {
		text-align: center;
		left: -1.5%;
		top: 4%;
		position: absolute;
	}
	.page-name {
		font-size: 26px;
		font-weight: 400;
		position: absolute;
		left: 37%;
		top: 6%;
		font-family: "AxieFont";
		color: white;
		width: 326px;
		text-align: center;
	}
	.character-name {
		font-size: 26px;
		font-weight: 400;
		position: absolute;
		left: 36%;
		top: 98%;
		font-family: "AxieFont";
		color: white;
	}
	.character-class {
		font-size: 20px;
		font-weight: 400;
		position: absolute;
		left: 26%;
		top: 89%;
		font-family: "AxieFont";
		color: white;
	}
	.character-level {
		font-size: 20px;
		font-weight: 400;
		position: absolute;
		font-family: "AxieFont";
		color: lawngreen;
		padding-left: 10px;
	}
	.grid-container
	{
		display: grid;
		grid-template-columns: 3fr 2fr 2fr 2fr 2.5fr;
		background-color: transparent;
		position: absolute;
		width: 100%;
		height: 60px;
		margin-top: 4px;
	}
	.grid-itemTitle {
		text-align: center;
		color: #a4785c;
		font-weight: 900;
		color: #a4785c;
		font-size: 14px;
	}
	.grid-itemLevel {
		font-weight: 900;
		color: #a4785c;
		font-size: 18px;
		padding-left: 15px;
	}
	.icon-img {
		font-weight: 1px;
		height: 24px;
		padding-right: 7px;
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
		font-size: 16px;
		position: absolute;
		padding-left: 15px;
	}
	.back-button {
		position:absolute;
        height: 100px !important;
        width: 106px !important;
		min-height: 70px !important;
        min-width: 70px !important;
        border-color: transparent;
        border-radius: 0 0 5rem 0rem;
        cursor: pointer;
        background:transparent;
		margin: 0 !important;
	}
	.previous-button {
		position:absolute;
		left: 31.5%;
		top: 5%;
        height: 57px !important;
        width: 50px !important;
        border-color: transparent;
        border-radius: 5rem 2rem 2rem 5rem;
        background:transparent;
		margin: 0 !important;
	}
	.next-button {
		position:absolute;
		left: 64.5%;
		top: 5%;
        height: 57px !important;
        width: 50px !important;
        border-color: transparent;
        border-radius: 2rem 5rem 5rem 2rem;
        background:transparent;
		margin: 0 !important;
	}
</style>
