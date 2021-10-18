<template>
    <div class="person">
        <div class="person-image">
            <img v-show="currentState === 'idle'" src="">
            <img v-show="currentState === 'attacking'" src="">
            <img v-show="currentState === 'focus'" src="">
        </div>
    </div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
    import { mapState } from "vuex";
	const Player = defineComponent({
		props: [],
		data() {
			return {
				currentState: '',
			}
		},
		components: {},
		computed: {
            ...mapState({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				currentState: (state: any) => state.game.player.currentState.activityState
			})
        },
		methods: {},
		watch: {}
	})
	export default Player;
</script>
<style scoped>

</style>
