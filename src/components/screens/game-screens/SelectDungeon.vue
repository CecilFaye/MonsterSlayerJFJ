<template>
	<teleport to="body">
		<div class="modal-container-overlay" v-if="show" >
			<div class="modal-container" :style="`background-image:url(${(screenImage)});`">
                <div class="modal-header">
                    DUNGEONS
                </div>
				<div class="modal-form">
					<img class="imgClose" :src="`${closeIcon}`" @click="onModalClose">
					<br>
                    <div class="dungeon-options-list" >
                        <div v-for="(dungeon, index) in dungeons" :key="`dun-${index}`" class="dungeon-option" >
                            <span>
                                <span v-bind:class="{level: dungeon.locked, 'enabled-level': !dungeon.locked  }">{{'Lv. ' + dungeon.recommendedLevel}}</span>
                                <span v-bind:class="{ 'disabled-name': dungeon.locked }">{{ ' - ' + dungeon.name}}</span>
                            </span>
                            <button v-if="!dungeon.locked" @click="enterDungeon(dungeon)" >
                                ENTER
                            </button><br>
                            <img v-if="!dungeon.locked" class="cards-img" :src="`${sampleDungeon}`">
                        </div>
                    </div>
				</div>

			</div>
		</div>
	</teleport>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-var-requires */
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { defineComponent, Prop, computed, ref } from "vue";
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { IDungeonResponse } from "@/store/types";

    const anyBg = require('@/assets/background/axie-dungeon.jpg');
    const field = require('@/assets/background/field.jpg');
	const closeIcon = require('@/assets/background/close-icon.png');

	const SelectDungeon = defineComponent({
		props: {
            show: { required: true } as Prop<boolean>
		},
		emits: {
			closeSelectDungeonModal: null
		},
		data()
		{
			return {
				screenImage: anyBg,
                sampleDungeon: field,
				closeIcon
			}
		},
		setup(props, context) {
			const service = useMonsterSlayerService();
			const onModalClose = () => { context.emit('closeSelectDungeonModal') };
            const dungeons = computed(() => {
				return getDungeons();
			});
            const getDungeons = () => {
                const dungeonList = service.getDungeons();
				return dungeonList?.sort((a,b) => a.recommendedLevel - b.recommendedLevel);
            };
            const enterDungeon = (dungeon: IDungeonResponse): void => {
                service.enterDungeon(dungeon._id);
            };

			return {
				onModalClose,
                enterDungeon,
                dungeons
			}
		}
	})
	export default SelectDungeon;
</script>
<style scoped>
    .modal-container-overlay {
        font-family: "AxieFont";
        position: fixed;
        display: block; /* Hidden by default */
        width: 100%; /* Full width (cover the whole page) */
        height: 100%; /* Full height (cover the whole page) */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 5;
        overflow: auto;
        color: #E4E1CB;

    }

    .modal-header
    {
        font-size: 40px;
        color: #6fd9d7;
        text-shadow: 3px 0 0 #183640, 0 -3px 0 #183640, 0 3px 0 #183640, -3px 0 0 #183640;
    }

    .imgClose
    {
        height: 30px;
        position: absolute;
        left: 92%;
        top: 0%;
        cursor: pointer;
    }
    .cards-img {
        height: 100%;
        width: 100%;
        border: 1px solid saddlebrown;
        margin-top:0.9rem;
    }
    .dungeon-options-list {
        display: flex;
        /* align-items: center;
        justify-content: center; */
        flex-direction: column;
        margin:20px;
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        border: solid 3px white;
        border-radius: 5px;
    }

    .dungeon-option {
        border: 2px solid #FFFF;
        color: #f5d06c;
        padding: 10px;
        font-size: 15px;
        font-weight: 800;
        background: transparent;
    }

    .modal-container {
        width: 450px;
        background-color: white;
        padding: 25px;
        color: black;
        position: absolute;
        left: calc(calc(100vw - 500px) / 2);
        top: 200px;
        border-radius: 15px;
    }

    .dungeon-option button {
        font-size: 14px;
        float: right;
        cursor: pointer;
    }

    .level {
        color: rgb(131, 29, 11);
    }

    .enabled-level {
        color: rgb(20, 240, 20);
    }

    .disabled-name {
        color: saddlebrown;
    }

    .modal-form {
        margin: 20px 0;
    }

    .modal-form > * {
        margin: 10px 0;
    }
</style>

