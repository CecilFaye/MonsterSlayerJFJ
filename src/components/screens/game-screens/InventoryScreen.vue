<template>
	<div class="inventory-layout">
        <div>
        </div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref } from "vue";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";

	// const { params } = useRoute();
	const InventoryScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const store = useStore();

			return {

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
        display: flex;
        background: khaki;
	}
</style>