<template>
	<div class="character-layout">
        <div>
            <p v-for="(log, index) in logs" class='log' :key="`log-${index}`">{{log}}</p>
        </div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref } from "vue";
	import { mapMutations } from "vuex";
	import { useStore } from "vuex";

	// const { params } = useRoute();
	const CharacterInfoScreen = defineComponent({
		props: {
			id: String
		},
		setup(props) {
			const store = useStore();

			return {

			};
		}
	})
	export default CharacterInfoScreen;
</script>
<style scoped>
	.character-layout {
		height: inherit;
		width: inherit;
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		overflow: hidden !important;
		margin: auto;
        display: flex;
        background: lightseagreen;
	}
</style>
