<template>
  <div class="home-screen" :style="`background-image:url(${(screenImage)});`">
    <div class="home-screen-options">
		<div class="home-screen-option" @click="showLoginModal = true">
			LOGIN
		</div>
		<div class="home-screen-option" @click="showSignUpModal = true">
			SIGN UP
		</div>
		<div class="home-screen-option" @click="goCredits()">
			CREDITS
		</div>
    </div>
  </div>
  <appLoginModal
    :show="showLoginModal"
    @closeModal="showLoginModal = false" />
  <appSignUpModal
    :show="showSignUpModal"
    @closeSignUpModal=" showSignUpModal = false" />
</template>

<script lang="ts">
	import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";
	import Login from './security/Login.vue';
	import SignUp from './security/SignUp.vue';

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const home = require('../../assets/background/vuexie-bg.jpg')
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const vuexieLogo = require('../../assets/background/vuexie-logo.png');

	const HomeScreen = defineComponent({
		components:{
			appLoginModal: Login,
			appSignUpModal: SignUp
		},
		props: [],
		setup() {
			const router = useRouter();
			const store = useStore();
			const gameName = store.state.name;
			const gameVersion = store.state.version;
			const showLoginModal = ref<boolean>(false);
			const showSignUpModal = ref<boolean>(false);
			const goCredits = ():void => {
				router.push('/credits');
			};
			return {
				gameName,
				gameVersion,
				showLoginModal,
				showSignUpModal,
				goCredits
			};
		},
		data() {
			return {
				screenImage: home,
				vuexieLogo
			}
		},
		methods: {
			...mapMutations({
				changeScreen: 'game/changeScreen'
			})
		}
	})
	export default HomeScreen;
</script>
<style scoped>

	.home-screen {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed!important;
		text-align: center;
		overflow: hidden !important;
	}

	.home-screen-title {
		width: 100%;
		margin: 0 auto 0 auto;
		font-family: 'Lato', sans-serif;
		line-height: 280px;
		font-size: 11.5rem;
		padding: 80px 50px;
		text-align: center;
		text-transform: uppercase;
		text-rendering: optimizeLegibility;
	}

	.home-screen-title::before {
		content:"";
		width: 100%;
		height: 50vh;
		position: absolute;
		top: -200px;
		left: 10px;
		transform: rotate(55deg);
		background: rgba(206,188,155,.7);
		background: -moz-linear-gradient(left, rgba(206,188,155,.7) 0%, rgba(42,31,25,0) 65%);
		background: -webkit-gradient(left top, right top, color-stop(0%, rgba(206,188,155,.7)), color-stop(65%, rgba(42,31,25,0)));
		background: -webkit-linear-gradient(left, rgba(206,188,155,.7) 0%, rgba(42,31,25,0) 65%);
		background: -o-linear-gradient(left, rgba(206,188,155,.7) 0%, rgba(42,31,25,0) 65%);
		background: -ms-linear-gradient(left, rgba(206,188,155,.7) 0%, rgba(42,31,25,0) 65%);
		background: linear-gradient(to right, rgba(206,188,155,.7) 0%, rgba(42,31,25,0) 65%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#cebc9b', endColorstr='#2a1f19', GradientType=0.7 );
	}

	#text3d {
		color: #70869d;
		letter-spacing: .15em;
		text-shadow:
		-1px -1px 1px #efede3,
		0px 1px 0 #2e2e2e,
		0px 2px 0 #2c2c2c,
		0px 3px 0 #2a2a2a,
		0px 4px 0 #282828,
		0px 5px 0 #262626,
		0px 6px 0 #242424,
		0px 7px 0 #222,
		0px 8px 0 #202020,
		0px 9px 0 #1e1e1e,
		0px 10px 0 #1c1c1c,
		0px 11px 0 #1a1a1a,
		0px 12px 0 #181818,
		0px 13px 0 #161616,
		0px 14px 0 #141414,
		0px 15px 0 #121212,
		2px 20px 5px rgba(0, 0, 0, 0.9),
		5px 23px 5px rgba(0, 0, 0, 0.3),
		8px 27px 8px rgba(0, 0, 0, 0.5),
		8px 28px 35px rgba(0, 0, 0, 0.9);
	}

	.home-screen-options {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 36%;
		left: 35%;
		width: 50rem;
	}

	.home-screen-option {
		border: 2px solid #FFFF;
		color: #FFFF;
		padding: 10px;
		font-size: 20px;
		font-weight: 800;
		margin: 15px;
		cursor: pointer;
	}
</style>
