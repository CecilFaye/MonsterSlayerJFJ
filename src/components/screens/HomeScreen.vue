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
		/* margin-top: 75px;
		color: #FFFF;
		font-size: 5rem;
		text-transform: uppercase;
		font-weight: 900;
		text-shadow: 0 2px 18px rgba(196, 191, 191, 0.26);
		font-family: Cardo, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
		position: absolute;
		top: 50%;
		right: 50%;
		transform: translate(50%,-50%);
		text-transform: uppercase;
		font-family: verdana;
		font-size: 12em;
		font-weight: 700;
		color: #c4c1c1;
		text-shadow: 1px 1px 1px #919191,
			1px 2px 1px #919191,
			1px 3px 1px #919191,
			1px 4px 1px #919191,
			1px 5px 1px #919191,
			1px 6px 1px #919191,
			1px 7px 1px #919191,
			1px 8px 1px #919191,
			1px 9px 1px #919191,
			1px 10px 1px #919191,
		1px 18px 6px rgba(16,16,16,0.4),
		1px 22px 10px rgba(16,16,16,0.2),
		1px 25px 35px rgba(16,16,16,0.2),
		1px 30px 60px rgba(16,16,16,0.4);
	}

	.home-screen-options {
		margin: 45px auto 0 auto;
		width: 30%;
		cursor: pointer;
	}

	.home-screen-option {
		border: 2px solid #FFFF;
		color: #FFFF;
		padding: 10px;
		font-size: 20px;
		font-weight: 800;
		margin: 25px;
	}
</style>
