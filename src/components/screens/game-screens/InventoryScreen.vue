
<template>
	<div class="inventory-layout">
        <div class="grid-container">
            <div class="left-side-grid">
                <div class="label">EQUIPMENTS</div>
                 <p class="item-class" v-for="(item, index) in inventoryList" :key="`skill-${index}`"> <img class="item-img" :src="`${partsImg}`" >
                    <span class="item-description" @click="itemInfo(item.item)">
                        {{item?.item?.name ?? ''}}

                    </span>
                    <span class="item-delete" @click="item.equipped ? () => {} : deleteItem(item)" v-bind:class="{ 'disabled-equip': item.equipped }">X</span>
                    <span class="item-equip" @click="equipItem(item.item)" v-if="!item.equipped" v-bind:class="{ 'disabled-equip': isInvalid(item.item) }">EQUIP</span>
                    <span class="item-equipped" v-if="item.equipped">EQUIPPED</span>

                </p>
            </div>
            <div class="right-side-grid">
                <div class="details">
                    <div class="label">DETAILS</div>
                    <div class="details-content" v-show="!!itemDetails?.name" >
                        <span class="sub-label"  >{{`Name: `}}</span>{{itemDetails?.name ?? ''}}<br>
                        <span  class="sub-label">{{`Type: `}}</span>{{itemType}} <br>
                        <span  class="sub-label">{{`Class: `}}</span>{{itemClass}}
                        <div v-bind:style="{paddingTop: '1rem'}">
                            <span  class="label">STATS BONUS</span>
                            <p class="bonus" v-for="(stat, index) in Object.keys(itemDetails?.bonus ?? [])" :key="`stat-${index}`">
                                <span class="sub-label">{{`${stat}: `}}</span>
                                {{`${Math.abs(itemDetails?.bonus[stat] ?? 0)}`}}
                            </p>
                        </div>
                    </div>
                    <div class="details-content" v-show="!itemDetails?.name">
                        <p class="default-details">Click item to show details.</p>
                    </div>
                </div>
                <div class="equipped">
                    <div class="label">EQUIPPED</div>
                    <p>
                        <span class="sub-label">Armor:</span>
                        <img v-if="!!equipment.armor?.name" class="item-img" :src="`${partsImg}`">
                        <span v-bind:class="{ 'item-desc-small': !!equipment.armor?.name }"  @click="itemInfo(equipment.armor)">{{equipment.armor?.name ?? ' ---'}}</span>
                        <span class="unequip" @click="removeItem(equipment?.armor)">{{equipment.armor?.name ? 'X' : ''}}</span>
                    </p>
                    <p>
                        <span class="sub-label">Weapon:</span>
                        <img v-if="!!equipment.weapon?.name" class="item-img" :src="`${partsImg}`" >
                        <span v-bind:class="{ 'item-desc-small': !!equipment.weapon?.name }" @click="itemInfo(equipment.weapon)">{{equipment.weapon?.name ?? ' ---'}}</span>
                        <span class="unequip" @click="removeItem(equipment?.weapon)">{{equipment.weapon?.name ? 'X' : ''}}</span>
                    </p>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-var-requires */
	import useMonsterSlayerService from "@/services/monster-slayer-service";
    import { IEquipment, IEquipmentRequest, IInventory, IItem } from "@/store/types";
    import { computed, defineComponent, ref } from "vue";

    const partsImg = require('../../../assets/inventory/sampleParts.png');

	const InventoryScreen = defineComponent({
		setup() {
            const service = useMonsterSlayerService();
			const equipment = ref<IEquipment>(service.getCharacterEquipment());
            const inventory = ref<IInventory[]>(service.getInventory());
            const itemDetails = ref<IItem>();
			const inventoryList = computed(() => {
                inventory.value?.forEach(inv => {
                    if (equipment.value?.weapon?._id === inv.item._id || equipment.value?.armor?._id === inv.item._id) {
                        inv.equipped = true;
                    } else {
                        inv.equipped = false;
                    }
                })
                return inventory.value;
            });
            const itemType = computed((): string => {
                const type = itemDetails.value?.type;
                if (type) {
                    return itemDetails.value.type.toUpperCase() === 'WPN' ? 'Weapon' : 'Armor';
                } else {
                    return '';
                }
            });
            const itemClass = computed((): string => {
                return service.getCharacterTypeName(itemDetails.value?.classId ?? 0)
            });

            const itemInfo = (item: IItem): void => {
                itemDetails.value = {...item};
            };
            const equipItem = (item: IItem): void => {
                if (!item || isInvalid(item)) return;
                if (confirm("Continue equip?")) {
                    const cur: IEquipmentRequest = {
                        weaponId: equipment.value?.weapon?._id ?? null,
                        armorId: equipment.value?.armor?._id ?? null
                    };
                    if (item.type === "WPN") {
                        cur.weaponId = item._id;
                    } else {
                        cur.armorId = item._id;
                    }
                    updateEquipment(cur);
                }
            };
            const updateEquipment = (update: IEquipmentRequest): void => {
                service.updateEquipment(update)
                .then(() => {
                    equipment.value = service.getCharacterEquipment();
                    inventory.value = service.getInventory();
                });
            };
            const removeItem = (item: IItem): void => {
                if (!item) return;
                if (confirm("Continue unequip item?")) {
                    const cur: IEquipmentRequest = {
                        weaponId: equipment.value?.weapon?._id ?? null,
                        armorId: equipment.value?.armor?._id ?? null
                    };
                    if (item.type === "WPN") {
                        cur.weaponId = null;
                    } else {
                        cur.armorId = null;
                    }
                    updateEquipment(cur);
                }
            };
            const deleteItem = (item: IInventory): void => {
                if (!item) return;
                if (item.equipped) {
                    alert('Item is currently equipped!');
                    return;
                }
                if (confirm("Continue delete?")) {
                    service.deleteEquipment(item._id)
                    .finally(() => inventory.value = service.getInventory());
                }
            };

            const isInvalid = (item: IItem): boolean => {
                const char = service.getCharacterDetails();
                return item.classId !== char.classType;
            };

			return {
                partsImg,
                inventoryList,
                equipment,
                itemInfo,
                equipItem,
                removeItem,
                isInvalid,
                deleteItem,
                itemClass,
                itemType,
                itemDetails
			};
		}
	})
	export default InventoryScreen;
</script>
<style scoped>
	.inventory-layout {
		background:transparent;
		margin: auto;
	}
    p {
        padding:0;
        margin: 1rem;
        color: #5f330e;
    }
    .bonus {
        padding:0;
        margin: 0;
    }
    .details-content {
        margin: 1rem;
        color: #5f330e;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 3fr 2fr;
        height: 37.7em;
        width: inherit;
        border: 2px solid #5f330e;
    }
    .grid-container .label {
        margin: 5px 0px;
    }
    .right-side-grid {
        display: grid;
        grid-template-rows: 2fr 1.8fr;
    }
    .details {
        border-bottom: 2px solid #5f330e;
        text-align: center;
    }
    .equipped {
        border-top: 2px solid #5f330e;
    }
    .grid-container > div {
        border: 2px solid #5f330e;
        text-align: left;
    }
    .left-side-grid {
        overflow-x: hidden;
        overflow-y: auto;
    }
    .item-img {
		height: 10%;
		width: 10%;
		vertical-align: middle;
    }
    .label {
		text-align: center;
		margin: auto;
		width: 100%;
		font-weight: 900;
		text-transform: uppercase;
		color:saddlebrown;
		font-family: "AxieFont";
	}
    .sub-label {
        color:#5f330e;
    }
    .item-class{
        text-decoration: none;
        color: #5f330e;
        margin-left: 10px;
    }
    .item-equip {
        font-size: 9px;
        color: #f5d06c;
        float: right;
        font-weight: bolder;
        cursor: pointer;
    }
    .item-equipped {
        font-size: 9px;
        color: rgb(11, 102, 38);
        float: right;
        cursor: default;
        font-weight: bolder;
    }
    .item-delete {
        font-size: 9px;
        color: maroon;
        float: right;
        cursor: pointer;
        font-weight:900;
        margin-left: 1rem;
    }
    .item-description {
        text-transform: uppercase;
        font-weight: 800;
        vertical-align: middle;
    }
    .item-description:hover, .item-desc-small:hover {
        color: #f5d06c;
        cursor: pointer;
    }
    .none:hover {
        color: inherit;
        cursor:default;
    }
    .sub-label {
		text-transform: uppercase;
        font-weight: 800;
	}
    .item-title {
        text-transform: uppercase;
        color: whitesmoke;
        font-weight: 800;
        top: 11.5%;
        left: 74%;
        font-size: 10px;
        position: absolute;
        text-align: center;
        width: 93px;
    }
    .unequip {
        color: #f5d06c;
        float: right;
        line-height: 1.2;
        padding-right: 5px;
        cursor: pointer;
    }
    .disabled-equip {
        color:gray;
        cursor: default;
    }
</style>