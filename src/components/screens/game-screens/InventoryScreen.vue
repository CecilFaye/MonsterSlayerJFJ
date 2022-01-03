
<template>
	<div class="inventory-layout">
         <div class="grid-container">
            <div class="item1">
                <span class="label-class"> PARTS</span>
                <p class="parts-class" @click="itemInfo(armor)">
                    <img class="logo-img" :src="`${partsImg}`" >
                    <span class="parts-description">{{armor?.name ?? ''}}</span>
                    <span class="parts-equip">EQUIP</span>
                </p>
                <p class="parts-class"  @click="itemInfo(weapon)">
                    <img class="logo-img" :src="`${partsImg}`">
                    <span class="parts-description">{{weapon?.name ?? ''}}</span>
                    <span class="parts-equip">EQUIP</span>
                </p>
            </div>
            <div class="item2">
                <span class="label-class"> DETAILS</span> <br>
                <div v-show="!!itemDetails?.name">
                <span>{{`Name: `}}<span class="item-text">{{itemDetails?.name ?? ''}}</span></span><br>
                <span>{{`Type: `}}<span class="item-text">{{itemType ?? ''}}</span></span><br>
                <span>{{`Class: `}}<span class="item-text">{{itemClass ?? ''}}</span></span>
                  <div v-bind:style="{marginTop: '2rem'}" class="arrangement">
                    <span class="item-text">STATS BONUS</span>
                    <span  v-for="(stat, index) in itemStatBonus" class='log' :key="`stat-${index}`">{{`${stat.key}: ${Math.abs(stat.value ?? 0)}`}}</span>
                </div>
                </div>
            </div>
            <div class="item3">
                <span class="label-class"> EQUIPPED</span>
            </div>
        </div>
        <!-- <div class="division">
            <ul>
                <li v-for="(equip, index) in equipments" :key="`equip-${index}`"><span @click="itemInfo(equip)">{{equip?.name ?? ''}}</span></li>
            </ul>
        </div> -->
         <!-- <div class="division">
             <div v-show="!!itemDetails?.name" class="arrangement">
                <span>{{`Name: `}}<span class="item-text">{{itemDetails?.name ?? ''}}</span></span>
                <span>{{`Type: `}}<span class="item-text">{{itemType ?? ''}}</span></span>
                <span>{{`Class: `}}<span class="item-text">{{itemClass ?? ''}}</span></span>
                <div v-bind:style="{marginTop: '2rem'}" class="arrangement">
                    <span class="item-text">STATS BONUS</span>
                    <span  v-for="(stat, index) in itemStatBonus" class='log' :key="`stat-${index}`">{{`${stat.key}: ${Math.abs(stat.value ?? 0)}`}}</span>
                </div>
            </div>
        </div> -->
	</div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { IEquipment, IItem } from "@/store/types";
    import { computed, defineComponent, ref } from "vue";

    const partsImg = require('../../../assets/inventory/sampleParts.png');

	const InventoryScreen = defineComponent({
		setup() {
            const service = useMonsterSlayerService();
			const equipments: IEquipment = service.getCharacterEquipment();
            const armor: IItem = equipments.armor;
            const weapon: IItem = equipments.weapon;
            const itemDetails = ref<IItem>();
            const itemInfo = (item: IItem): void => {
                itemDetails.value = {...item};
            };
            const itemType = computed((): string => {
                const type = itemDetails.value?.type;
                if (type) {
                    return itemDetails.value.type.toUpperCase() === 'WPN' ? 'WEAPON' : 'ARMOR';
                } else {
                    return '';
                }
            });
            const itemClass = computed((): string => {
                return service.getCharacterTypeName(itemDetails.value?.classId ?? 0)
            });
            const itemStatBonus = computed(() => {
				const bonus = itemDetails.value?.bonus;
				return bonus ? Object.keys(bonus).map(key => Object.assign({}, { key, value: bonus[key] })) : [];
			});
			return {
                equipments,
                armor,
                weapon,
                itemInfo,
                partsImg,
                itemType,
                itemClass,
                itemStatBonus,
                itemDetails
			};
		}
	})
	export default InventoryScreen;
</script>
<style scoped>
	.inventory-layout {
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
        background:transparent;
        flex-direction: row;
	}
    .label-class {
        color: white;
        margin-left: 8px;
        font-size: 17px;
    }
    .arrangement {
        display: flex;
        flex-direction: column;
    }
    span {
		font-size: 11px;
		font-weight: 800;
	}
	.header-stat {
		padding: 10px 0;
	}
    li {
        cursor: pointer;
        text-decoration: none;
    }
    p:hover {
        color: whitesmoke;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 5fr 3fr;
        height: 37em;
        width: inherit;
        border: 2px solid #5f330e;
    }
    .item1 {
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .grid-container > div {
        border: 2px solid #5f330e;
        font-size: 30px;
        text-align: left;
    }
    .item-text {
        text-transform: uppercase;
        color: whitesmoke;
    }
    p {
		font-size: 20px;
		font-weight: 800;
	}
    .parts-class{
        cursor: pointer;
        text-decoration: none;
        margin-top: 17px;
        color: #5f330e;
        padding:10px;
    }
    .parts-description{
        margin-left: 72px;
        font-size: 17px;
    }
    .parts-equip {
        color: #f5d06c;
        position: absolute;
        left: 39%;
        font-size: 12px;
    }
    .logo-img {
        position: absolute;
        height: 7%;
        left: 16%;
        top: 12%;
    }
</style>