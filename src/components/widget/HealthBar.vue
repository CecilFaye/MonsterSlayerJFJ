<template>
	<div class="health-bar-container">
        <div id="health-bar" v-bind:style="{ width: health + '%', background: health < 30 ? 'red' : 'green'}"></div>
    </div>
</template>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-empty-function */
    import { computed, defineComponent } from "vue";
    import { useStore } from "vuex";

	const HealthBarWidget = defineComponent({
		props: {
            personType: { type: String }
        },
		setup(props) {
            // Properties
			const store = useStore();

            // Computed
			const health = computed(() => {
                const currentHealth = store.state.game[`${props.personType}`].currentState.health;
                return currentHealth < 1 ? 0 : currentHealth;
            });
            return {
                health
			}
        }
	})
	export default HealthBarWidget;
</script>
<style scoped>
    .health-bar-container {
        height: 2rem;
        margin: 0.1rem 6rem;
        opacity: 0.8;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.86);
    }
    #health-bar {
        width: 1%;
        height: 2rem;
    }
</style>