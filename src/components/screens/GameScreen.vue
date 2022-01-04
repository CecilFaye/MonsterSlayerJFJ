<template>
	<div class="base-game-screen" :style="`background-image:url(${(screenImage)});`">
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onBeforeMount } from "vue";
	import { useRouter } from "vue-router";
	import useMonsterSlayerService from "@/services/monster-slayer-service";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const battleScreenImage = require('../../assets/background/vuexie-battle.jpg')

	const GameScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const router = useRouter();
			const service = useMonsterSlayerService()
			const screenImage = battleScreenImage;
			const gameRoute = `/game/${props.id}`;

			onBeforeMount(() => {
				service.initFromSession();
			});


			const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`)
			};

			return {
				screenImage,
				navigateToRoute
			};
		}
	})
	export default GameScreen;
</script>
<style scoped>
	.base-game-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow: hidden !important;
	}
</style>
