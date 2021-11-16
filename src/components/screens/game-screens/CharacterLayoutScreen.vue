
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
			</div>
			<button class="battle-button" @click="navigateToRoute('battle')">Battle</button>
			<button class="logout-button" @click="logout">Logout</button>
		</div>
		<div class="info-container">
			<router-view></router-view>
		</div>
	</div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	import { defineComponent, onBeforeMount, ref } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";
	import * as helper from "@/app-lib/services/session-helper";

	const characterScreenImage = require('../../../assets/background/vuexie-info-main.png');
	const battleScreenImage = require('../../../assets/background/arena.jpg');
	const characterImage = require('../../../assets/background/faye-gift.gif');

	// const { params } = useRoute();
	const CharacterLayoutScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const store = useStore();
			const router = useRouter();

			const gameName = store.state.name;
			const gameVersion = store.state.version;
			const screenImage = characterScreenImage;
			const gameRoute = `/game`;

			const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`);
			};

			const logout = () => {
				helper.clearAllSessionValues();
				setTimeout(() => router.push('/'), 1000);
			};
			onBeforeMount(() => {
				store.commit('game/initFromSession');
			});

			return {
				gameName,
				gameVersion,
				screenImage,
				characterImage,
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
		height:300px;
	}
	.axie-side {
		text-align: center;
		top: 33%;
		left: 18%;
		position: absolute;
	}
</style>
