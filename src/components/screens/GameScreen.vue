<template>
	<div class="base-game-screen" :style="`background-image:url(${(screenImage)});`">
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onBeforeMount, ref } from "vue";
	import { useStore } from "vuex";
	import { useRoute, useRouter } from "vue-router";

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const battleScreenImage = require('../../assets/background/vuexie-battle.jpg')

	const GameScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const store = useStore();
			const router = useRouter();
			const gameName = store.state.name;
			const gameVersion = store.state.version;
			const screenImage = battleScreenImage;
			const gameRoute = `/game/${props.id}`;

			// Lifecycle Hooks
			onBeforeMount(() => {
				store.commit('game/initFromSession');
			});


			const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`)
			};

			return {
				gameName,
				gameVersion,
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
		text-align: center;
		overflow: hidden !important;
	}

</style>
