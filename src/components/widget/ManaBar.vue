<template>
	<div class="mana-bar-container">
        <div id="mana-bar" v-bind:style="{ width: mana + '%'}"></div>
    </div>
</template>
<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
    import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";

	const ManaBarWidget = defineComponent({
		props: {
            personType: { type: String }
        },
		setup(props) {
            // Properties
			const store = useStore();

            // Computed
			const mana = computed(() => store.state.game[`${props.personType}`].currentState.mana);
            return {
                mana
			}
        }
	})
	export default ManaBarWidget;
</script>
<style scoped>
    .mana-bar-container {
        height: 1rem;
        /* margin: 0.1rem 6rem; */
        opacity: 0.8;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.86);
    }
    #mana-bar {
        width: 1%;
        height: 1rem;
        background-color: blue;
    }
</style>