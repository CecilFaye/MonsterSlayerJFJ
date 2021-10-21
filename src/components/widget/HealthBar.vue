<template>
	<div class="health-bar-container">
        <div id="health-bar"></div>
    </div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
    import { PersonType } from "@/store/types";
    import { computed, defineComponent, Prop } from "vue";
    import { useStore } from "vuex";

	const HealthBarWidget = defineComponent({
		props: {
            personType: { type: String }
        },
		setup(props) {

            // Properties
            const service = useMonsterSlayerService();
			const store = useStore();

            // Computed
			const character = computed(() => store.state.game[`${props.personType}`]);
            return {
                character
			}
        }
	})
	export default HealthBarWidget;
</script>
<style scoped>

</style>