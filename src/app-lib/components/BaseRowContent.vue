<template>
	<div class="row-content">
		<div class="row-header">
			<slot name="header"></slot>
		</div>
		<div class="row-body">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const BaseRowContent = defineComponent({
})

export default BaseRowContent;
</script>

<style scoped>
	.row-header {
		color: #002699;
		font-size: 10px;
		padding-bottom: 5px;
	}

	.row-content {
		min-width: 25%;
	}

	.row-body {
		min-height: 32px;
	}
</style>