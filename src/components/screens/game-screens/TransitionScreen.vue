
<template>
    <div class="main-stage-container" :style="`background-image:url(${(backdropScreenImage)});`">
        <div class="main-stage-layout center" >
            <div class="bg" :style="`background-image:url(${(screenBackground)});`">
                <span class="char-name-container">
                    <span class="char-level">{{ 'Lv.' + character?.level}}</span>
                    <span class="char-name">{{ ' ' + character?.name }}</span>
                </span>
                <span class="mons-name-container">
                    <span class="mons-name">{{ ' ' + monster?.name }}</span>
                    <span class="mons-level">{{ 'Lv.' + monster?.level}}</span>
                </span>
                <div class="vuexie-left-side">
                    <img class="vuexie-img" :src="`${characterImage}`">
                </div>
                 <div class="vuexie-right-side">
                    <img class="vuexie-img" :src="`${monsterImage}`">
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */
    import { useMonsterEngine } from "@/services/monster-engine";
    import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { computed, defineComponent, ref } from "vue";
    import { useRouter } from "vue-router";

    const screenBackground = require('@/assets/background/loading-fight.png');
	const backdropScreenImage = require('@/assets/background/vuexie-battle.jpg');
    const logoImage = require('@/assets/logo/vuexie-logo.png');
    const characterImage =  require('@/assets/hero/playerAqua-idle.gif');
    const monsterImage =  require('@/assets/monster/monsterPlant-idle.gif');

	const TransitionScreen = defineComponent({
		setup() {
            const gameRoute = `/game`;
            const service = useMonsterSlayerService();
            const monsService = useMonsterEngine();
            const router = useRouter();
            const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`);
			};
            const character = computed(() => {
				return service.getCharacterDetails();
			});
            const monster = computed(() => {
				return monsService.genMonsterData();
			});

            setTimeout(() => {
                navigateToRoute('fight');
            }, 5000);

			return {
                backdropScreenImage,
                screenBackground,
                characterImage,
                character,
                monster,
                logoImage,
                monsterImage
			};
		}
	})
	export default TransitionScreen;
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
    .mons-name-container {
        position: absolute;
        top: 5%;
        left: 65%;
        font-weight: 900;
        font-size: 18px;
        width: 28rem;
        text-align: right;
    }
    .mons-name {
        padding-right: 5px;
        color: maroon;
        max-width: 200px;
    }
    .mons-level {
        color: rgb(37, 20, 13);
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
		/* height:500px; */
	}
	.vuexie-left-side {
		text-align: left;
        top: 20%;
        position: absolute;
        height: 42em;
        width: 72em;
	}
    .vuexie-right-side {
		text-align: right;
        top: 20%;
        left: 30%;
        position: absolute;
        height: 42em;
        width: 72em;
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