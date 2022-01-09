
<template>
	<transition name="fade">
		<!-- <div class="battle-controls" v-show="battleStart"> -->
		<div class="battle-controls">
			<span class="cards" v-for="(skill, index) in actionSkills" :key="`ctrl-${index}`" @click="attack(skill)" :disabled="!playerTurn">
				<img class="cards-img" :src="`${cardsImg}`">
				<span v-bind:class="['skill-title',`pt-${index}`]">{{skill?.name ?? ''}}</span>
				<span v-bind:class="['skill-mana', `pm-${index}`]">{{`${Math.abs(skill?.cost ?? 0)}`}}</span>
				<span v-bind:class="['skill-damage', `pd-${index}`]">{{skill?.target != 'self' ? Math.abs(skill?.damage ?? 0) : 0}}</span>
				<span v-bind:class="['skill-heal', `ph-${index}`]">{{skill?.target === 'self' ? Math.abs(skill?.damage ?? 0) : 0}}</span>
				<span v-bind:class="['skill-target', `ptar-${index}`]">{{`Target: ${skill?.target ?? ''}`}}</span>
				<span v-bind:class="['skill-type', `ptyp-${index}`]">{{`Type: ${skill?.type ? skillTypeName(skill?.type) : ''}`}}</span>
			</span>
		</div>
	</transition>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	/* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
	import { GetterTypes } from "@/store/modules/game/getters";
import { MutationTypes } from "@/store/modules/game/mutations";
    import { ActivityStateOptions, IAction, ISkill, PersonType } from "@/store/types";
    import { computed, defineComponent, watch } from "vue";
    import { useStore } from "vuex";
	const cardsImg = require('@/assets/skills/archer-arrowAssault.png');
	const BattleControlWidget = defineComponent({
		props: [],
		setup() {
            const service = useMonsterSlayerService();
			const store = useStore();

            // Methods
			const attack = (skill: ISkill): void =>  action(skill, PersonType.Player);

			watch(() => store.state.game[`${PersonType.Monsters}`].turn, (value, oldValue) => {
				if (value) {
					setTimeout(() => {
						const skills: ISkill[] = store.getters['game/' + GetterTypes.getCharacterSkills](PersonType.Monsters);
						const monsterAttack = skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle)[service.randomAction(skills.length-1)];
						action(monsterAttack, PersonType.Monsters);
					}, 2000);
				}
			});

			const action = (skill: ISkill, type: PersonType) => {
				store.commit('game/' + MutationTypes.action,
				{
					work: { personType: type, actionTaken: skill} as IAction,
					reset: service.gameResult
				});
			};
			const getClassName = (className: string, index: number) => {
				return `${className}-${index}`;
			};

			// Computed
			const actionSkills = computed(() => {
				const skills: ISkill[] = store.getters['game/' + GetterTypes.getCharacterSkills]('player');
				return skills.filter(skill => skill.skillType !== ActivityStateOptions.Idle);
			});
			const playerTurn = computed(() => {
				return store.state.game.player.turn;
			});
			const battleStart = computed(() => {
				return store.state.game.battleStart;
			});

            return {
                attack,
				playerTurn,
				battleStart,
                actionSkills,
				cardsImg,
				getClassName
			}
        }
	})
	export default BattleControlWidget;
</script>
<style scoped>
	button {
		margin: 5px;
		min-width: 120px;
		height: 15rem;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		padding: 0.7rem;
		text-transform: uppercase;

        box-shadow: 0px 4px 5px #00000033;
        border-radius: 15px;
	}

    .battle-controls {
		width: 100%;
		margin: auto;
		padding: 1rem;
		text-align: center;
		display: inline-flex;
	}
	.cards {
		height: 15rem;
		width: 12.3rem;
		cursor: pointer;
	}
	.cards:hover {
        background: rgba(189, 124, 93, 0.199);
    }
	.cards-img {
        height: inherit;
        width: inherit;
    }
	.skill-title {
        text-transform: uppercase;
        color: whitesmoke;
        font-weight: 800;
        top: 12.5%;
        font-size: 10px;
        position: absolute;
        text-align: center;
        width: 88px;
    }
	.pt-0 {
		left: 9%;
	}
	.pt-1 {
		left: 32.5%;
	}
	.pt-2 {
		left: 56%;
	}
	.pt-3 {
		left: 79.6%;
	}
	.pm-0 {
		left: 3.5%;
	}
	.pm-1 {
		left: 27.3%;
	}
	.pm-2 {
		left: 50.5%;
	}
	.pm-3 {
		left: 74.5%;
	}
	.pd-0, .ph-0 {
		left: 1.5%;
	}
	.pd-1, .ph-1 {
		left: 25.3%;
	}
	.pd-2, .ph-2 {
		left: 49%;
	}
	.pd-3, .ph-3 {
		left: 72.5%;
	}
	.ptar-0 {
		left: 9%;
	}
	.ptar-1 {
		left: 32.5%;
	}
	.ptar-2 {
		left: 56%;
	}
	.ptar-3 {
		left: 79.6%;
	}
	.ptyp-0 {
		left: 9%;
	}
	.ptyp-1 {
		left: 32.5%;
	}
	.ptyp-2 {
		left: 56%;
	}
	.ptyp-3 {
		left: 79.6%;
	}
    .skill-mana {
        text-transform: uppercase;
        color: rgb(0, 0, 177);
        font-weight: 800;
        top: 10.3%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-damage {
        text-transform: uppercase;
        color: red;
        font-weight: 800;
        top: 26%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-heal {
        text-transform: uppercase;
        color: rgb(28, 172, 71);
        font-weight: 800;
        top: 40%;
        font-size: 17px;
        position: absolute;
        text-align: center;
        width: 35px;
    }
    .skill-target {
		color: whitesmoke;
		top: 70%;
		position: absolute;
		text-transform: capitalize;
    }

	.skill-type {
		color: whitesmoke;
		top: 76%;
		position: absolute;
		text-transform: capitalize;
    }
</style>