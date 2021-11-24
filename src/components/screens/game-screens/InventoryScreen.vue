<template>
	<div class="inventory-layout">
        <div class="division">
            <ul>
                <li v-for="(equip, index) in equipments" :key="`equip-${index}`"><span @click="itemInfo(equip)">{{equip?.name ?? ''}}</span></li>
            </ul>
        </div>
         <div class="division">
             <div v-show="!!itemDetails?.name" class="arrangement">
                <span>{{`Name: `}}<span class="item-text">{{itemDetails?.name ?? ''}}</span></span>
                <span>{{`Type: `}}<span class="item-text">{{itemType ?? ''}}</span></span>
                <span>{{`Class: `}}<span class="item-text">{{itemClass ?? ''}}</span></span>
                <div v-bind:style="{marginTop: '2rem'}" class="arrangement">
                    <span class="item-text">STATS BONUS</span>
                    <span  v-for="(stat, index) in itemStatBonus" class='log' :key="`stat-${index}`">{{`${stat.key}: ${Math.abs(stat.value ?? 0)}`}}</span>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { IItem } from "@/store/types";
    import { computed, defineComponent, ref } from "vue";

	const InventoryScreen = defineComponent({
		setup() {
            const service = useMonsterSlayerService();
			const equipments = service.getCharacterEquipment();
            const itemDetails = ref<IItem>();
            console.log(equipments);
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
                itemInfo,
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
		height: inherit;
		width: inherit;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
        background:transparent;
        display: flex;
        flex-direction: row;
	}
    .division {
        width: 50%;
        padding: 3rem 2rem;
    }
    .arrangement {
        display: flex;
        flex-direction: column;
    }
    span {
		font-size: 20px;
		font-weight: 800;
	}
	.header-stat {
		padding: 10px 0;
	}
    li {
        cursor: pointer;
        text-decoration: none;
    }
    li:hover {
        color: whitesmoke;
    }
    .item-text {
        text-transform: uppercase;
        color: whitesmoke;
    }
    p {
		font-size: 20px;
		font-weight: 800;
	}
</style>