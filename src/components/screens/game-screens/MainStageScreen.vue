
<template>
    <div class="main-stage-container" :style="`background-image:url(${(backdropScreenImage)});`">
        <div class="main-stage-layout center" >
            <div class="bg" :style="`background-image:url(${(screenBackground)});`">
                <span class="char-name-container">
                    <span class="char-level">{{ 'Lv.' + character.level}}</span>
                    <span class="char-name">{{ ' ' + character.name }}</span>
                </span>
                <button class="credit-button"></button>
                <button class="bottom-menu-button char-button" @click="navigateToRoute('character')"></button>
                <button class="bottom-menu-button skills-button" @click="navigateToRoute('skills')"></button>
                <button class="bottom-menu-button inventory-button" @click="navigateToRoute('inventory')"></button>
                <button class="side-menu-button auto-dungeon-button"></button>
                <button class="side-menu-button select-dungeon-button" @click="showSelectDungeonModal=true"></button>
                <button class="side-menu-button logout-button" @click="logout()"></button>
                <div class="vuexie-side">
                    <img class="vuexie-img" :src="`${characterImage}`">
                </div>
                <div class="vuexie-logo">
                    <img class="vuexie-logo-img" :src="`${logoImage}`">
                </div>
            </div>
        </div>
    </div>
    <appSelectDungeonModal :show="showSelectDungeonModal" @closeSelectDungeonModal="showSelectDungeonModal=false" />
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { computed, defineComponent, ref } from "vue";
    import { useRouter } from "vue-router";
    import SelectDungeon from "./SelectDungeon.vue";

    const screenBackground = require('@/assets/background/main-stage.png');
	const backdropScreenImage = require('@/assets/background/vuexie-battle.jpg');
    const logoImage = require('@/assets/logo/vuexie-logo.png');
    const characterImage =  require('@/assets/hero/playerAqua-idle.gif');

	const MainStageScreen = defineComponent({
        components:{
			appSelectDungeonModal: SelectDungeon
		},
		setup() {
            const gameRoute = `/game`;
            const service = useMonsterSlayerService();
            const router = useRouter();
            const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`);
			};
            const showSelectDungeonModal = ref<boolean>(false);
            const character = computed(() => {
				return service.getCharacterDetails();
			});
            const logout = service.logout;

			return {
                backdropScreenImage,
                screenBackground,
                characterImage,
                character,
                logoImage,
                navigateToRoute,
                showSelectDungeonModal,
                logout
			};
		}
	})
	export default MainStageScreen;
</script>
<style scoped>
    button::-moz-focus-inner {
        border:0;
        padding:0;
    }
    .main-stage-container {
        height: 100vh;
    }
	.main-stage-layout {
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

    button:hover {
        background: rgba(189, 124, 93, 0.199);
    }

    .bottom-menu-button {
        position:absolute;
        top: 79%;
        height: 125px;
        width: 125px;
        border-color: transparent;
        border-radius: 5rem;
        cursor: pointer;
        background:transparent;
    }

    .char-name-container {
        position:absolute;
        top:5%;
        left: 7.5%;
        font-weight: 900;
        font-size: 18px;
    }
    .char-name {
        padding-right: 5px;
        color: #ffff;
        max-width: 200px;
    }
    .char-level {
        color: rgb(46, 243, 7);
    }

    .char-button {
        left: 3.3%;
    }

    .skills-button {
        left: 15.1%;
    }

    .inventory-button {
        left: 27.1%;
    }

    .side-menu-button {
        left: 70.3%;
        position:absolute;

        width: 281px;
        border-color: transparent;
        border-radius: 1rem;
        cursor: pointer;
        background:transparent;
    }

    .logout-button {
        top: 82.5%;
        height: 64px;
    }

    .select-dungeon-button {
        top: 64%;
        height: 110px;
    }

    .auto-dungeon-button {
        top: 46.5%;
        height: 110px;
    }

    .credit-button:hover {
        background: none;
    }
    .credit-button {
        position:absolute;
        left: 36.4%;
        top: 1.5%;
        height: 99px;
        width: 99px;
        border-color: transparent;
        border-radius: 1rem;
        cursor: pointer;
        background:transparent;
        z-index: 1;
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
    .vuexie-img {
		height:500px;
	}
	.vuexie-side {
		text-align: center;
		top: 9%;
		left: -3%;
		position: absolute;
	}
    .vuexie-logo-img {
		height:100px;
	}
	.vuexie-logo {
		text-align: center;
		top: 23%;
		left: 67.4%;
		position: absolute;
	}
</style>