<template>
  <div class="home-screen" :style="`background-image:url(${(screenImage)});`">
    <div class="home-screen-title">
		<h3>Vuezard Quest</h3>
    </div>
    <div class="home-screen-options">
		<div class="home-screen-option" @click="changeScreen('gameScreen')">
			PLAY GAME
		</div>
		<div class="home-screen-option" @click="changeScreen('creditScreen')">
			CREDITS
		</div>
    </div>
  </div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const home = require('../../assets/background/castle.gif')

	const HomeScreen = defineComponent({
		props: [],
		setup() {
			const store = useStore();

			return {
				store,
			};
		},
		data() {
			return {
				screenImage: home,
			}
		},
		components: {

		},
		computed: {},
		methods: {
			...mapMutations({
				changeScreen: 'game/changeScreen'
			})
		},
		watch: {}
	})
	export default HomeScreen;
</script>
<style scoped>
	.home-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		overflow:hidden;
		text-align: center;
	}

	.home-screen-title {
		margin-top: 75px;
	}

	.home-screen-options {
		margin: 45px auto 0 auto;
		width: 30%;
		cursor: pointer;
	}

	.home-screen-option {
		border: 2px solid #72e3f1;
		color: #72e3f1;
		padding: 10px;
		font-size: 20px;
		font-weight: 800;
		margin: 25px;
	}
</style>
