
<template>
    <div class="main-stage-container" :style="`background-image:url(${(backdropScreenImage)});`">
        <div class="main-stage-layout center" >
            <transition name="fade">
            <div class="bg" :style="`background-image:url(${(screenBackground)});`">
                <div class="char-name-container">
                    <span class="char-level">{{ 'Lv.' + character.level}}</span>
                    <span class="char-name">{{ ' ' + character.name }}</span>
                    <div class="char-bars">
                        <HealthBarWidget :personType="'player'"/>
                        <ManaBarWidget :personType="'player'"/>
                    </div>
                </div>
                <div class="mons-name-container">
                    <span class="mons-name">{{ ' ' + character.name }}</span>
                    <span class="mons-level">{{ 'Lv.' + character.level}}</span>
                    <div class="mons-bars">
                        <HealthBarWidget :personType="'player'"/>
                        <ManaBarWidget :personType="'player'"/>
                    </div>
                </div>
                <div class="vuexie-left-side" v-bind:class="{ 'char-attacking': charAttacking && !charToSelf }">
                    <img class="vuexie-img" :src="`${ charAttacking ? (charToSelf ? characterImageHeal : characterImageAttacking) : characterImage }`">
                </div>
                <div class="vuexie-right-side" v-bind:class="{ 'mons-attacking': monsAttacking && !monsToSelf }">
                    <img class="vuexie-img" :src="`${ monsAttacking ? (monsToSelf ? monsterImageHeal : monsterImageAttacking) : monsterImage }`">
                </div>
                <div class="player-controls">
                    <BattleControlWidget/>
                </div>
                <div class="logs">
                    <LogsWidget/>
                </div>
            </div>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */
	import BattleControlWidget from "@/components/widget/BattleControls.vue";
    import HealthBarWidget from "@/components/widget/HealthBar.vue";
    import LogsWidget from "@/components/widget/Logs.vue";
    import ManaBarWidget from "@/components/widget/ManaBar.vue";
    import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { ActivityStateOptions, PersonType } from "@/store/types";
    import { computed, defineComponent, onBeforeMount, ref } from "vue";
    import { useRouter } from "vue-router";

    const screenBackground = require('@/assets/background/inside-castle.jpg');
	const backdropScreenImage = require('@/assets/background/vuexie-battle.jpg');
    const logoImage = require('@/assets/logo/vuexie-logo.png');

    const characterImage =  require('@/assets/hero/playerAqua-idle.gif');
    const characterImageAttacking =  require('@/assets/hero/playerBeast-attack.gif');
    const characterImageHeal =  require('@/assets/hero/playerBeast-focus.gif');

    const monsterImage =  require('@/assets/monster/monsterPlant-idle.gif');
    const monsterImageAttacking =  require('@/assets/monster/monsterPlant-attack.gif');
    const monsterImageHeal =  require('@/assets/monster/monsterPlant-focus.gif');

	const FightScreen = defineComponent({
        components: {
			HealthBarWidget,
			ManaBarWidget,
            BattleControlWidget,
            LogsWidget
		},
		setup() {
            const gameRoute = `/game`;
            const service = useMonsterSlayerService();
            const router = useRouter();
            onBeforeMount(() => {
				service.gameReset();
			});
            const navigateToRoute = (routeName: string) => {
				router.push(`${gameRoute}/${routeName}`);
			};
            const character = computed(() => {
				return service.getCharacterDetails();
			});
            const charAttacking = computed(() => {
				return service.isAttacking(PersonType.Player);
			});
            const monsAttacking = computed(() => {
				return service.isAttacking(PersonType.Monsters);
			});
            const charToSelf = computed(() => {
				return service.toSelf(PersonType.Player);
			});
            const monsToSelf = computed(() => {
				return service.toSelf(PersonType.Monsters);
			});
            const getCharacterImage = (type: ActivityStateOptions, propsType: PersonType) => service.getCharacterImage(propsType, type);

            setTimeout(() => {
                navigateToRoute('fight');
            }, 5000);

			return {
                backdropScreenImage,
                screenBackground,
                characterImage,
                character,
                logoImage,
                monsterImage,
                monsAttacking,
                charAttacking,
                getCharacterImage,
                characterImageAttacking,
                characterImageHeal,
                monsterImageAttacking,
                monsterImageHeal,
                charToSelf,
                monsToSelf
			};
		}
	})
	export default FightScreen;
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
    .char-bars, .mons-bars {
        width: 300px;
    }
    .player-controls {
        width: 50%;
        height: 30%;
        position: absolute;
        top: 70%;
        /* background:lightskyblue; */
    }
    .logs {
        width: 50%;
        height: 30%;
        position: absolute;
        top: 70%;
        left: 50%;
    }
    .mons-name-container {
        position: absolute;
        top: 5%;
        left: 69%;
        font-weight: 900;
        font-size: 18px;
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

	.vuexie-left-side {
		text-align: left;
        top: 20%;
        position: absolute;
        height: 42em;
        width: 86em;
	}
    .char-attacking {
        text-align: right;
    }
    .vuexie-right-side {
		text-align: right;
        top: 20%;
        left: 17.5%;
        position: absolute;
        height: 42em;
        width: 86em;
	}
    .mons-attacking {
        text-align: left;
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